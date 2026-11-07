import { NextResponse } from "next/server";
import {
  findCurrentSession,
  getSessionToken,
  unauthorizedResponse,
} from "@/lib/game/session-access";
import GameSession from "@/models/GameSession";
import {
  calculateAnswerPoints,
  isValidAnswerChoice,
} from "@/lib/game/answers";

export async function POST(request) {
  const token = getSessionToken(request);
  if (!token) return unauthorizedResponse(NextResponse);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Lựa chọn không hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (
    !Number.isInteger(payload?.questionIndex) ||
    payload.questionIndex < 0 ||
    payload.questionIndex > 999 ||
    typeof payload.questionCode !== "string"
  ) {
    return NextResponse.json(
      { error: "Câu hỏi không hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const gameSession = await findCurrentSession(token);
    if (
      !gameSession ||
      gameSession.gameVersion !== "quiz-v3" ||
      gameSession.status !== "in_progress" ||
      gameSession.expiresAt <= new Date()
    ) {
      return unauthorizedResponse(NextResponse);
    }

    const progress = gameSession.quizProgress;
    const question = progress?.questionSnapshots?.[payload.questionIndex];
    if (
      !progress ||
      !question ||
      payload.questionIndex !== progress.currentQuestionIndex ||
      payload.questionCode !== question.questionCode
    ) {
      return NextResponse.json(
        { error: "Câu hỏi này đã được trả lời hoặc phiên chơi đã thay đổi." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!isValidAnswerChoice(payload.choice, question.options, question.answerMode)) {
      return NextResponse.json(
        { error: "Hãy chọn một hoặc nhiều phương án hợp lệ." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const choice = [...payload.choice].sort();
    const expected = [...question.correctAnswer].sort();
    const isCorrect =
      question.answerMode === "single"
        ? choice.length === 1 && expected.includes(choice[0])
        : choice.length === expected.length &&
          choice.every((answer, index) => answer === expected[index]);
    const points = calculateAnswerPoints(
      choice,
      expected,
      question.answerMode,
    );
    const now = new Date();
    const nextIndex = payload.questionIndex + 1;
    const completed = nextIndex === progress.questionCount;
    const updatedSession = await GameSession.findOneAndUpdate(
      {
        _id: gameSession._id,
        gameVersion: "quiz-v3",
        status: "in_progress",
        "quizProgress.currentQuestionIndex": payload.questionIndex,
        expiresAt: { $gt: now },
      },
      {
        $push: {
          "quizProgress.answers": {
            questionCode: question.questionCode,
            choice,
            isCorrect,
            points,
            answeredAt: now,
          },
        },
        $inc: { score: points },
        $set: completed
          ? {
              "quizProgress.currentQuestionIndex": nextIndex,
              status: "completed",
              completedAt: now,
              duration: Math.floor((now - gameSession.startedAt) / 1000),
            }
          : { "quizProgress.currentQuestionIndex": nextIndex },
      },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedSession) {
      return NextResponse.json(
        { error: "Câu hỏi đã được trả lời hoặc phiên chơi đã hết hạn." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      {
        questionIndex: payload.questionIndex,
        questionCount: progress.questionCount,
        isCorrect,
        points,
        score: updatedSession.score,
        explanation: question.explanation,
        lesson: question.lesson,
        legalArticles: question.legalArticles,
        legalBasis: question.legalBasis,
        legalReviewRequired: question.legalReviewRequired,
        correctAnswer: question.options
          .filter((option) => expected.includes(option.id))
          .map((option) => option.label),
        completed,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Submitting quiz answer failed:", error?.name ?? "Unknown error");
    return NextResponse.json(
      { error: "Không thể lưu câu trả lời lúc này." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
