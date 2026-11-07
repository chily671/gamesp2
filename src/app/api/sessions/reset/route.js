import { NextResponse } from "next/server";
import GameSession from "@/models/GameSession";
import Player from "@/models/Player";
import { getSessionToken, findCurrentSession } from "@/lib/game/session-access";

export async function POST(request) {
  const token = getSessionToken(request);
  const response = NextResponse.json(
    { reset: true },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set({
    name: "data-trap-session",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api",
    maxAge: 0,
  });

  if (!token) {
    return response;
  }

  try {
    const gameSession = await findCurrentSession(token);
    if (!gameSession) return response;

    await Promise.all([
      GameSession.deleteOne({ _id: gameSession._id }),
      Player.deleteOne({ _id: gameSession.playerId }),
    ]);
    return response;
  } catch (error) {
    console.error("Resetting player session failed:", error?.name ?? "Unknown error");
    return NextResponse.json(
      { error: "Không thể xóa phiên này lúc này. Hãy thử lại." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
