import { NextResponse } from "next/server";
import { requireActiveRpgSession } from "@/lib/game/rpg-session";
import GameSession from "@/models/GameSession";
import {
  buildRpgEnding,
  clampScore,
  getAvailableStageThreeActions,
  getDecisionEffect,
} from "@/lib/game/rpg";

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Kế hoạch xử lý không hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const actionIds = payload?.actions;
  if (
    !Array.isArray(actionIds) ||
    actionIds.length === 0 ||
    actionIds.length > 3 ||
    actionIds.some((actionId) => typeof actionId !== "string") ||
    new Set(actionIds).size !== actionIds.length
  ) {
    return NextResponse.json(
      { error: "Chọn từ một đến ba hành động khác nhau." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const result = await requireActiveRpgSession(request, NextResponse);
    if (result.error) return result.error;

    const { gameSession, character } = result;
    const progress = gameSession.rpgProgress;
    if (progress.currentStage !== 3) {
      return NextResponse.json(
        { error: "Sự cố chưa sẵn sàng để xử lý." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    const availableIds = new Set(
      getAvailableStageThreeActions(progress).map((action) => action.id),
    );
    if (
      actionIds.some((actionId) => !availableIds.has(actionId)) ||
      (actionIds.includes("share-code") && actionIds.length !== 1)
    ) {
      return NextResponse.json(
        { error: "Kế hoạch chứa hành động không khả dụng trong tình huống này." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const decisions = actionIds.map((actionId) => ({
      stage: 3,
      actionId,
      ...getDecisionEffect(actionId),
      evidenceIds: [...progress.evidenceInventory],
      decidedAt: new Date(),
    }));
    const dataRiskDelta = decisions.reduce(
      (total, decision) => total + decision.dataRiskDelta,
      0,
    );
    const protectionDelta = decisions.reduce(
      (total, decision) => total + decision.protectionDelta,
      0,
    );
    const dataRisk = clampScore(progress.dataRisk + dataRiskDelta);
    const protectionScore = clampScore(
      progress.protectionScore + protectionDelta,
    );
    const endingId = actionIds.includes("share-code")
      ? "exposed"
      : dataRisk <= 40 && protectionScore >= 30
        ? "contained"
        : "partial";
    const now = new Date();
    const updated = await GameSession.findOneAndUpdate(
      {
        _id: gameSession._id,
        gameVersion: "rpg-v2",
        status: "in_progress",
        "rpgProgress.currentStage": 3,
        expiresAt: { $gt: now },
      },
      {
        $set: {
          currentStage: 3,
          status: "completed",
          completedAt: now,
          duration: Math.max(
            0,
            Math.floor((now - gameSession.startedAt) / 1000),
          ),
          "rpgProgress.currentStage": 3,
          "rpgProgress.dataRisk": dataRisk,
          "rpgProgress.protectionScore": protectionScore,
          "rpgProgress.endingId": endingId,
        },
        $push: {
          "rpgProgress.decisions": { $each: decisions },
        },
        $inc: { score: actionIds.includes("share-code") ? 0 : 10 * actionIds.length },
      },
      { returnDocument: "after", runValidators: true },
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Phiên chơi đã hết hạn hoặc kết quả đã được lưu." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      {
        status: updated.status,
        dataRisk,
        protectionScore,
        ending: buildRpgEnding(character, endingId),
        evidenceInventory: updated.rpgProgress.evidenceInventory,
        completedAt: updated.completedAt,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Resolving RPG incident failed:", error?.name ?? "Unknown error");
    return NextResponse.json(
      { error: "Không thể lưu phương án xử lý lúc này." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
