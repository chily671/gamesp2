import { NextResponse } from "next/server";
import { requireActiveRpgSession } from "@/lib/game/rpg-session";
import GameSession from "@/models/GameSession";
import { clampScore } from "@/lib/game/rpg";

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Lựa chọn không hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const actionId = payload?.actionId;
  if (!["limit-permission", "grant-broad-access"].includes(actionId)) {
    return NextResponse.json(
      { error: "Hãy chọn một cách xử lý quyền ứng dụng hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const result = await requireActiveRpgSession(request, NextResponse);
    if (result.error) return result.error;

    const { gameSession } = result;
    const limited = actionId === "limit-permission";
    const dataRiskDelta = limited ? -10 : 20;
    const protectionDelta = limited ? 20 : 0;
    const now = new Date();
    const updated = await GameSession.findOneAndUpdate(
      {
        _id: gameSession._id,
        gameVersion: "rpg-v2",
        status: "in_progress",
        "rpgProgress.currentStage": 1,
        "rpgProgress.storyFlags": { $ne: "stage01-completed" },
      },
      {
        $set: {
          currentStage: 1,
          "rpgProgress.currentStage": 2,
          "rpgProgress.dataRisk": clampScore(
            gameSession.rpgProgress.dataRisk + dataRiskDelta,
          ),
          "rpgProgress.protectionScore": clampScore(
            gameSession.rpgProgress.protectionScore + protectionDelta,
          ),
        },
        $addToSet: {
          "rpgProgress.storyFlags": {
            $each: [
              "stage01-completed",
              limited ? "permission-limited" : "permission-broad",
            ],
          },
        },
        $push: {
          "rpgProgress.decisions": {
            stage: 1,
            actionId,
            dataRiskDelta,
            protectionDelta,
            evidenceIds: [],
            decidedAt: now,
          },
        },
        $inc: { score: limited ? 10 : 0 },
      },
      { returnDocument: "after", runValidators: true },
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Quyết định Stage 01 đã được ghi hoặc phiên chơi đã thay đổi." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      {
        stage: updated.rpgProgress.currentStage,
        dataRisk: updated.rpgProgress.dataRisk,
        protectionScore: updated.rpgProgress.protectionScore,
        consequence: limited
          ? "Ứng dụng chỉ được tiếp cận dữ liệu đã chọn."
          : "Quyền truy cập rộng làm xuất hiện thêm dấu vết trong nhật ký Stage 02.",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Saving RPG Stage 01 decision failed:", error?.name ?? "Unknown error");
    return NextResponse.json(
      { error: "Không thể lưu quyết định lúc này." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
