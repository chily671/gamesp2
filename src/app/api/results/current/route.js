import { NextResponse } from "next/server";
import CharacterProfile from "@/models/CharacterProfile";
import Player from "@/models/Player";
import {
  findCurrentSession,
  getSessionToken,
  unauthorizedResponse,
} from "@/lib/game/session-access";
import { getAchievement } from "@/lib/scoring/achievements";

export async function GET(request) {
  const token = getSessionToken(request);

  if (!token) {
    return unauthorizedResponse(NextResponse);
  }

  try {
    const gameSession = await findCurrentSession(token);

    if (
      !gameSession ||
      !["completed", "expired"].includes(gameSession.status)
    ) {
      return NextResponse.json(
        { error: "Phiên chơi chưa có kết quả cuối." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    const [player, character] = await Promise.all([
      Player.findOne({
        _id: gameSession.playerId,
        expiresAt: { $gt: new Date() },
      })
        .select("playerCode fullName className")
        .lean(),
      CharacterProfile.findById(gameSession.characterId)
        .select("characterName persona isDemoOnly")
        .lean(),
    ]);

    if (!player || !character || character.isDemoOnly !== true) {
      return unauthorizedResponse(NextResponse);
    }

    const completedStages = gameSession.answers.length;
    const correctAnswers = gameSession.answers.filter(
      (answer) => answer.isCorrect,
    ).length;

    return NextResponse.json(
      {
        status: gameSession.status,
        playerCode: player.playerCode,
        fullName: player.fullName,
        className: player.className,
        characterName: character.characterName,
        persona: character.persona,
        score: gameSession.score,
        completedStages,
        correctAnswers,
        accuracy: completedStages
          ? Math.round((correctAnswers / completedStages) * 100)
          : 0,
        duration: gameSession.duration ?? 0,
        achievement: getAchievement(gameSession.score, completedStages),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Loading results failed:", error?.name ?? "Unknown error");
    return NextResponse.json(
      { error: "Không thể tải kết quả lúc này." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
