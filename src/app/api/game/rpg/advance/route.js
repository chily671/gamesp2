import { NextResponse } from "next/server";
import { requireActiveRpgSession } from "@/lib/game/rpg-session";
import GameSession from "@/models/GameSession";

export async function POST(request) {
  try {
    const result = await requireActiveRpgSession(request, NextResponse);
    if (result.error) return result.error;

    const { gameSession } = result;
    if (
      gameSession.rpgProgress.currentStage !== 2 ||
      gameSession.rpgProgress.evidenceInventory.length < 2
    ) {
      return NextResponse.json(
        { error: "Hãy khám phá và thu thập ít nhất hai bằng chứng trước." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    const updated = await GameSession.findOneAndUpdate(
      {
        _id: gameSession._id,
        gameVersion: "rpg-v2",
        status: "in_progress",
        "rpgProgress.currentStage": 2,
        "rpgProgress.evidenceInventory.1": { $exists: true },
      },
      {
        $set: {
          currentStage: 2,
          "rpgProgress.currentStage": 3,
        },
      },
      { returnDocument: "after", runValidators: true },
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Chưa đủ bằng chứng hoặc Stage đã được chuyển." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      {
        stage: updated.rpgProgress.currentStage,
        evidenceCount: updated.rpgProgress.evidenceInventory.length,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Advancing RPG stage failed:", error?.name ?? "Unknown error");
    return NextResponse.json(
      { error: "Không thể chuyển Stage lúc này." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
