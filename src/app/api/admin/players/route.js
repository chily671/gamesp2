import { NextResponse } from "next/server";
import GameSession from "@/models/GameSession";
import Player from "@/models/Player";
import connectToDatabase from "@/lib/mongodb";
import {
  getAdminCookieName,
  isAdminAuthConfigured,
  isAdminCookieValid,
} from "@/lib/admin/auth";

export async function GET(request) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { error: "Khu vực quản trị chưa được cấu hình đầy đủ." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (
    !isAdminCookieValid(request.cookies.get(getAdminCookieName())?.value)
  ) {
    return NextResponse.json(
      { error: "Cần đăng nhập quản trị." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    await connectToDatabase();
    const players = await Player.find({ expiresAt: { $gt: new Date() } })
      .select("playerCode fullName className createdAt expiresAt")
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();
    const playerIds = players.map((player) => player._id);
    const sessions = await GameSession.find({
      playerId: { $in: playerIds },
      retentionExpiresAt: { $gt: new Date() },
    })
      .populate("characterId", "characterName persona")
      .select("playerId status score answers duration startedAt")
      .lean();
    const sessionByPlayer = new Map(
      sessions.map((session) => [String(session.playerId), session]),
    );

    return NextResponse.json(
      {
        players: players.map((player) => {
          const session = sessionByPlayer.get(String(player._id));
          const answered = session?.answers?.length ?? 0;
          const correct =
            session?.answers?.filter((answer) => answer.isCorrect).length ?? 0;
          return {
            playerCode: player.playerCode,
            fullName: player.fullName,
            className: player.className,
            createdAt: player.createdAt,
            expiresAt: player.expiresAt,
            status: session?.status ?? "no-session",
            score: session?.score ?? 0,
            duration: session?.duration ?? null,
            accuracy: answered ? Math.round((correct / answered) * 100) : 0,
            character: session?.characterId ?? null,
          };
        }),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Loading admin player records failed:", error?.name ?? "Unknown error");
    return NextResponse.json(
      { error: "Không thể tải danh sách người chơi." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
