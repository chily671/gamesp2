import { NextResponse } from "next/server";
import {
  findCurrentSession,
  getSessionToken,
  unauthorizedResponse,
} from "@/lib/game/session-access";
import Mission from "@/models/Mission";
import GameSession from "@/models/GameSession";
import {
  calculateAnswerPoints,
  isValidAnswerChoice,
} from "@/lib/game/answers";

export async function POST(request) {
  const token = getSessionToken(request);

  if (!token) {
    return unauthorizedResponse(NextResponse);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Lựa chọn không hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!Number.isInteger(payload?.stage) || payload.stage < 1 || payload.stage > 4) {
    return NextResponse.json(
      { error: "Mã nhiệm vụ không hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const gameSession = await findCurrentSession(token);

    if (
      !gameSession ||
      (gameSession.gameVersion &&
        gameSession.gameVersion !== "legacy-v1") ||
      gameSession.status !== "in_progress" ||
      gameSession.expiresAt <= new Date()
    ) {
      return unauthorizedResponse(NextResponse);
    }

    const mission = await Mission.findOne({
      stage: payload.stage,
    })
      .select("+correctAnswer")
      .lean();

    if (!mission) {
      return NextResponse.json(
        { error: "Không tìm thấy nhiệm vụ." },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!isValidAnswerChoice(payload.choice, mission.options, mission.answerMode)) {
      return NextResponse.json(
        { error: "Hãy chọn một hoặc nhiều phương án hợp lệ." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const choice = [...payload.choice].sort();
    const expected = [...mission.correctAnswer].sort();
    const isCorrect =
      mission.answerMode === "single"
        ? choice.length === 1 && expected.includes(choice[0])
        : choice.length === expected.length &&
          choice.every((answer, index) => answer === expected[index]);
    const points = calculateAnswerPoints(choice, expected, mission.answerMode);
    const now = new Date();
    const finalStage = payload.stage === 4;
    const updatedSession = await GameSession.findOneAndUpdate(
      {
        _id: gameSession._id,
        status: "in_progress",
        currentStage: payload.stage - 1,
        expiresAt: { $gt: now },
      },
      {
        $push: {
          answers: {
            stage: payload.stage,
            choice,
            isCorrect,
            points,
            answeredAt: now,
          },
        },
        $inc: { score: points },
        $set: finalStage
          ? {
              currentStage: payload.stage,
              status: "completed",
              completedAt: now,
              duration: Math.floor((now - gameSession.startedAt) / 1000),
            }
          : { currentStage: payload.stage },
      },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedSession) {
      return NextResponse.json(
        { error: "Nhiệm vụ này đã được trả lời hoặc phiên chơi đã hết hạn." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      {
        stage: payload.stage,
        isCorrect,
        points,
        score: updatedSession.score,
        explanation: mission.explanation,
        lesson: mission.lesson,
        legalBasis: mission.legalBasis,
        legalReviewRequired: mission.legalReviewRequired,
        correctAnswer: mission.options
          .filter((option) => expected.includes(option.id))
          .map((option) => option.label),
        completed: finalStage,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Submitting mission answer failed:", error?.name ?? "Unknown error");
    return NextResponse.json(
      { error: "Không thể lưu lựa chọn lúc này." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
