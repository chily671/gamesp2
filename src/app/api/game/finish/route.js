import { NextResponse } from "next/server";
import {
  findCurrentSession,
  getSessionToken,
  unauthorizedResponse,
} from "@/lib/game/session-access";

export async function POST(request) {
  const token = getSessionToken(request);

  if (!token) {
    return unauthorizedResponse(NextResponse);
  }

  try {
    const gameSession = await findCurrentSession(token);

    if (!gameSession || gameSession.status !== "in_progress") {
      return unauthorizedResponse(NextResponse);
    }

    const now = new Date();

    if (gameSession.expiresAt > now) {
      return NextResponse.json(
        { error: "Phiên chơi vẫn còn thời gian." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    gameSession.status = "expired";
    gameSession.completedAt = now;
    gameSession.duration = Math.max(
      0,
      Math.floor((now - gameSession.startedAt) / 1000),
    );
    await gameSession.save();

    return NextResponse.json(
      { status: "expired" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Expiring game session failed:", error?.name ?? "Unknown error");
    return NextResponse.json(
      { error: "Không thể kết thúc phiên lúc này." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
