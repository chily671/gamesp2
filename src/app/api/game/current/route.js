import { NextResponse } from "next/server";
import {
  findCurrentSession,
  getSessionToken,
  publicMission,
  unauthorizedResponse,
} from "@/lib/game/session-access";
import Mission from "@/models/Mission";
import CharacterProfile from "@/models/CharacterProfile";

export async function GET(request) {
  const token = getSessionToken(request);

  if (!token) {
    return unauthorizedResponse(NextResponse);
  }

  try {
    const gameSession = await findCurrentSession(token);

    if (!gameSession) {
      return unauthorizedResponse(NextResponse);
    }

    if (["completed", "expired"].includes(gameSession.status)) {
      return NextResponse.json(
        {
          status: gameSession.status,
          currentStage: gameSession.currentStage,
          score: gameSession.score,
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    if (gameSession.status === "in_progress" && gameSession.expiresAt <= new Date()) {
      gameSession.status = "expired";
      gameSession.completedAt = new Date();
      gameSession.duration = Math.max(
        0,
        Math.floor((gameSession.completedAt - gameSession.startedAt) / 1000),
      );
      await gameSession.save();
      return NextResponse.json(
        { error: "Thời gian chơi đã hết.", expired: true },
        { status: 410, headers: { "Cache-Control": "no-store" } },
      );
    }

    const nextStage = gameSession.currentStage + 1;
    const [mission, character] =
      gameSession.status === "registered"
        ? [null, null]
        : await Promise.all([
            Mission.findOne({ stage: nextStage }).lean(),
            CharacterProfile.findById(gameSession.characterId)
              .select("characterName persona")
              .lean(),
          ]);

    if (gameSession.status === "in_progress" && !mission) {
      return NextResponse.json(
        { error: "Không tìm thấy nhiệm vụ tiếp theo." },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }

    const missionResponse = mission ? publicMission(mission) : null;
    if (missionResponse && character) {
      missionResponse.story = missionResponse.story.replaceAll(
        "{characterName}",
        character.characterName,
      );
    }

    return NextResponse.json(
      {
        status: gameSession.status,
        currentStage: gameSession.currentStage,
        score: gameSession.score,
        expiresAt: gameSession.expiresAt,
        character: character
          ? {
              name: character.characterName,
              persona: character.persona,
            }
          : null,
        completedStages: gameSession.answers.map((answer) => ({
          stage: answer.stage,
          isCorrect: answer.isCorrect,
          points: answer.points,
        })),
        mission: missionResponse,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Loading current mission failed:", error?.name ?? "Unknown error");
    return NextResponse.json(
      { error: "Không thể tải nhiệm vụ lúc này." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
