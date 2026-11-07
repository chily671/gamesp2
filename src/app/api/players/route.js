import { randomBytes, randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import CharacterProfile from "@/models/CharacterProfile";
import GameSession from "@/models/GameSession";
import Player from "@/models/Player";
import connectToDatabase from "@/lib/mongodb";
import {
  getDataExpirationDate,
  getSessionExpirationDate,
} from "@/lib/utils/data-retention";
import {
  createCharacterSnapshot,
  getInitialRpgProgress,
} from "@/lib/game/rpg";
import {
  createSessionToken,
  hashSessionToken,
} from "@/lib/utils/session-token";

function isValidName(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= 80 &&
    /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u.test(value.trim().normalize("NFC"))
  );
}

function isValidClassName(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= 20 &&
    /^[\p{L}\p{N}][\p{L}\p{N}\s.'’/-]*$/u.test(value.trim().normalize("NFC"))
  );
}

function serviceUnavailable(message) {
  return NextResponse.json(
    { error: message },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Thông tin gửi lên không hợp lệ. Vui lòng thử lại." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!isValidName(payload?.fullName) || !isValidClassName(payload?.className)) {
    return NextResponse.json(
      { error: "Vui lòng nhập họ tên và lớp hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    await connectToDatabase();
    const activeProfiles = await CharacterProfile.find({
      isActive: true,
      isDemoOnly: true,
    }).lean();

    if (activeProfiles.length === 0) {
      return serviceUnavailable(
        "Chưa có hồ sơ nhân vật. Vui lòng báo người quản lý sự kiện.",
      );
    }

    const character = activeProfiles[randomInt(activeProfiles.length)];
    if (!character.storyline) {
      return serviceUnavailable(
        "Hồ sơ nhân vật chưa có nội dung RPG hoàn chỉnh. Vui lòng báo người quản lý sự kiện.",
      );
    }
    const now = new Date();
    const dataExpiresAt = getDataExpirationDate(now);
    const sessionExpiresAt = getSessionExpirationDate(now);
    const player = await Player.create({
      playerCode: `P-${randomBytes(6).toString("hex").toUpperCase()}`,
      fullName: payload.fullName.trim().normalize("NFC"),
      className: payload.className.trim().normalize("NFC"),
      noticePresentedAt: now,
      noticeVersion: "player-registration-v1",
      expiresAt: dataExpiresAt,
    });
    const sessionToken = createSessionToken();

    try {
      await GameSession.create({
        sessionCodeHash: hashSessionToken(sessionToken),
        playerId: player._id,
        characterId: character._id,
        characterSnapshot: createCharacterSnapshot(character),
        gameVersion: "rpg-v2",
        rpgProgress: getInitialRpgProgress(character),
        status: "registered",
        startedAt: now,
        expiresAt: sessionExpiresAt,
        retentionExpiresAt: dataExpiresAt,
      });
    } catch (error) {
      await Player.deleteOne({ _id: player._id });
      throw error;
    }

    const response = NextResponse.json(
      {
        player: { fullName: player.fullName, className: player.className },
      },
      {
        status: 201,
        headers: { "Cache-Control": "no-store", Vary: "Cookie" },
      },
    );
    response.cookies.set({
      name: "data-trap-session",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: dataExpiresAt,
      maxAge: Math.max(
        0,
        Math.floor((dataExpiresAt.getTime() - Date.now()) / 1000),
      ),
      path: "/api",
    });
    return response;
  } catch (error) {
    if (
      error?.code === "MONGODB_URI_MISSING" ||
      error?.code === "INVALID_DATA_RETENTION_DAYS" ||
      error?.code === "INVALID_SESSION_DURATION_MINUTES"
    ) {
      console.error("Player registration configuration error:", error.code);
      return serviceUnavailable(
        "Trò chơi chưa được cấu hình đầy đủ. Vui lòng báo người quản lý sự kiện.",
      );
    }

    console.error(
      "Player registration failed:",
      error?.name ?? "Unknown error",
      error?.code ?? "",
    );
    return serviceUnavailable(
      "Chưa thể tạo phiên chơi lúc này. Vui lòng thử lại sau.",
    );
  }
}
