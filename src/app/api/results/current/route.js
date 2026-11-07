import { NextResponse } from "next/server";
import Player from "@/models/Player";
import {
  findCurrentSession,
  getSessionCharacter,
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
      getSessionCharacter(gameSession),
    ]);

    if (!player || !character || character.isDemoOnly !== true) {
      return unauthorizedResponse(NextResponse);
    }

    const isRpg = gameSession.gameVersion === "rpg-v2";
    const isQuiz = gameSession.gameVersion === "quiz-v3";
    const quizAnswers = gameSession.quizProgress?.answers ?? [];
    const completedStages = isRpg
      ? gameSession.status === "completed"
        ? 3
        : Math.max(0, gameSession.rpgProgress.currentStage - 1)
      : isQuiz
        ? quizAnswers.length
        : gameSession.answers.length;
    const correctAnswers = (isQuiz ? quizAnswers : gameSession.answers).filter(
      (answer) => answer.isCorrect,
    ).length;
    const evidence = isRpg
      ? character.storyline.stage02.artifacts
          .filter((artifact) =>
            gameSession.rpgProgress.evidenceInventory.includes(
              artifact.evidenceId,
            ),
          )
          .map(({ title, body, evidenceId }) => ({
            title,
            body,
            evidenceId,
          }))
      : undefined;
    const ending =
      isRpg && gameSession.rpgProgress.endingId
        ? {
            id: gameSession.rpgProgress.endingId,
            narrative:
              gameSession.rpgProgress.endingId === "contained"
                ? character.storyline.stage03.safeEnding
                : character.storyline.stage03.exposedEnding,
          }
        : null;

    return NextResponse.json(
      {
        status: gameSession.status,
        gameVersion: gameSession.gameVersion,
        playerCode: player.playerCode,
        fullName: player.fullName,
        className: player.className,
        characterName: character.characterName,
        persona: character.persona,
        score: gameSession.score,
        completedStages,
        ...(isQuiz
          ? {
              quiz: {
                questionCount:
                  gameSession.quizProgress?.questionCount ?? completedStages,
              },
            }
          : {}),
        correctAnswers,
        accuracy: completedStages
          ? Math.round((correctAnswers / completedStages) * 100)
          : 0,
        duration: gameSession.duration ?? 0,
        achievement: getAchievement(
          gameSession.score,
          completedStages,
          gameSession.gameVersion,
        ),
        ...(isRpg
          ? {
              rpg: {
                dataRisk: gameSession.rpgProgress.dataRisk,
                protectionScore: gameSession.rpgProgress.protectionScore,
                evidence,
                ending,
                decisions: gameSession.rpgProgress.decisions.map(
                  ({ stage, actionId, evidenceIds, decidedAt }) => ({
                    stage,
                    actionId,
                    evidenceIds,
                    decidedAt,
                  }),
                ),
              },
            }
          : {}),
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
