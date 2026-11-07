import { NextResponse } from "next/server";
import { findCurrentSession, getSessionToken, unauthorizedResponse } from "@/lib/game/session-access";
import Mission from "@/models/Mission";
import { getSessionExpirationDate } from "@/lib/utils/data-retention";

export async function POST(request) {
  const token = getSessionToken(request);

  if (!token) {
    return unauthorizedResponse(NextResponse);
  }

  try {
    const gameSession = await findCurrentSession(token);

    if (!gameSession || gameSession.status === "completed" || gameSession.status === "expired") {
      return unauthorizedResponse(NextResponse);
    }

    if (gameSession.status === "registered") {
      const now = new Date();
      gameSession.status = "in_progress";
      gameSession.currentStage = 0;
      gameSession.startedAt = now;
      gameSession.expiresAt = getSessionExpirationDate(now);
      await gameSession.save();
    } else if (gameSession.expiresAt <= new Date()) {
      gameSession.status = "expired";
      gameSession.completedAt = new Date();
      gameSession.duration = Math.max(
        0,
        Math.floor((gameSession.completedAt - gameSession.startedAt) / 1000),
      );
      await gameSession.save();
      return NextResponse.json(
        { error: "Thời gian chơi đã hết." },
        { status: 410, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (gameSession.gameVersion === "rpg-v2") {
      if (!gameSession.rpgProgress || !gameSession.characterSnapshot?.storyline) {
        return NextResponse.json(
          { error: "Phiên RPG chưa có đủ dữ liệu để bắt đầu." },
          { status: 503, headers: { "Cache-Control": "no-store" } },
        );
      }

      return NextResponse.json(
        {
          startedAt: gameSession.startedAt,
          expiresAt: gameSession.expiresAt,
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const activeMissionCount = await Mission.countDocuments({ isActive: true });

    if (activeMissionCount !== 4) {
      return NextResponse.json(
        { error: "Bốn nhiệm vụ cần được bật trước khi bắt đầu." },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      {
        startedAt: gameSession.startedAt,
        expiresAt: gameSession.expiresAt,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Starting game failed:", error?.name ?? "Unknown error");
    return NextResponse.json(
      { error: "Không thể bắt đầu nhiệm vụ lúc này." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
