import { NextResponse } from "next/server";
import GameSession from "@/models/GameSession";
import Player from "@/models/Player";
import connectToDatabase from "@/lib/mongodb";
import { getSessionCharacter } from "@/lib/game/session-access";
import { hashSessionToken } from "@/lib/utils/session-token";

function unauthorized() {
  return NextResponse.json(
    { error: "Phiên chơi không hợp lệ hoặc đã hết hạn." },
    {
      status: 401,
      headers: { "Cache-Control": "no-store", Vary: "Cookie" },
    },
  );
}

export async function GET(request) {
  const sessionToken = request.cookies.get("data-trap-session")?.value;

  if (
    typeof sessionToken !== "string" ||
    sessionToken.length < 40 ||
    sessionToken.length > 50 ||
    [...sessionToken].some(
      (character) =>
        !(
          (character >= "a" && character <= "z") ||
          (character >= "A" && character <= "Z") ||
          (character >= "0" && character <= "9") ||
          character === "_" ||
          character === "-"
        ),
    )
  ) {
    return unauthorized();
  }

  try {
    await connectToDatabase();
    const gameSession = await GameSession.findOne({
      sessionCodeHash: hashSessionToken(sessionToken),
      expiresAt: { $gt: new Date() },
      status: { $in: ["registered", "in_progress"] },
    }).lean();

    if (!gameSession) {
      return unauthorized();
    }

    const [player, character] = await Promise.all([
      Player.findOne({
        _id: gameSession.playerId,
        expiresAt: { $gt: new Date() },
      })
        .select("fullName className")
        .lean(),
      getSessionCharacter(gameSession),
    ]);

    if (!player || !character) {
      return unauthorized();
    }

    return NextResponse.json(
      {
        player: {
          fullName: player.fullName,
          className: player.className,
        },
        gameVersion: gameSession.gameVersion ?? "legacy-v1",
        character: {
          characterCode: character.characterCode,
          characterName: character.characterName,
          persona: character.persona,
          age: character.age,
          gender: character.gender,
          className: character.className,
          school: character.school,
          address: character.address,
          housing: character.housing,
          familyMembers: character.familyMembers,
          contact: {
            phone: character.contact.phone,
            email: character.contact.email,
            demoOnly: true,
          },
          socialAccounts: {
            facebookUsername: character.socialAccounts.facebookUsername,
            maskedPassword: "•••••••• — DEMO ONLY",
            demoOnly: true,
          },
          financialInfo: {
            simulatedBalance: character.financialInfo.simulatedBalance,
            currencyLabel: character.financialInfo.currencyLabel,
            demoOnly: true,
          },
          relationshipStatus: character.relationshipStatus,
          lifestyle: character.lifestyle,
          riskFactors: character.riskFactors,
          digitalFootprint: character.digitalFootprint,
          isDemoOnly: true,
        },
      },
      {
        headers: { "Cache-Control": "no-store", Vary: "Cookie" },
      },
    );
  } catch (error) {
    console.error(
      "Loading player session failed:",
      error?.name ?? "Unknown error",
      error?.code ?? "",
    );
    return NextResponse.json(
      { error: "Chưa thể tải hồ sơ nhân vật. Vui lòng thử lại." },
      {
        status: 503,
        headers: { "Cache-Control": "no-store", Vary: "Cookie" },
      },
    );
  }
}
