import { NextResponse } from "next/server";
import { requireActiveRpgSession } from "@/lib/game/rpg-session";
import GameSession from "@/models/GameSession";
import { getVisibleArtifacts } from "@/lib/game/rpg";

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Vật thể được chọn không hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (typeof payload?.artifactId !== "string") {
    return NextResponse.json(
      { error: "Hãy chọn một vật thể để kiểm tra." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const result = await requireActiveRpgSession(request, NextResponse);
    if (result.error) return result.error;

    const { gameSession, character } = result;
    if (gameSession.rpgProgress.currentStage !== 2) {
      return NextResponse.json(
        { error: "Vật thể này chưa thể kiểm tra ở Stage hiện tại." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    const artifact = getVisibleArtifacts(
      character,
      gameSession.rpgProgress.storyFlags,
    ).find((item) => item.id === payload.artifactId);
    if (!artifact) {
      return NextResponse.json(
        { error: "Không tìm thấy vật thể có thể kiểm tra." },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (
      gameSession.rpgProgress.discoveredInteractables.includes(artifact.id)
    ) {
      return NextResponse.json(
        {
          artifact: {
            id: artifact.id,
            title: artifact.title,
            body: artifact.body,
            evidenceId: artifact.evidenceId,
          },
          alreadyDiscovered: true,
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const updated = await GameSession.findOneAndUpdate(
      {
        _id: gameSession._id,
        gameVersion: "rpg-v2",
        status: "in_progress",
        "rpgProgress.currentStage": 2,
        "rpgProgress.discoveredInteractables": { $ne: artifact.id },
      },
      {
        $addToSet: {
          "rpgProgress.discoveredInteractables": artifact.id,
          "rpgProgress.evidenceInventory": artifact.evidenceId,
        },
        $inc: { score: 5 },
      },
      { returnDocument: "after", runValidators: true },
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Vật thể đã được kiểm tra hoặc phiên chơi đã thay đổi." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      {
        artifact: {
          id: artifact.id,
          title: artifact.title,
          body: artifact.body,
          evidenceId: artifact.evidenceId,
        },
        alreadyDiscovered: false,
        evidenceCount: updated.rpgProgress.evidenceInventory.length,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Inspecting RPG evidence failed:", error?.name ?? "Unknown error");
    return NextResponse.json(
      { error: "Không thể ghi nhận bằng chứng lúc này." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
