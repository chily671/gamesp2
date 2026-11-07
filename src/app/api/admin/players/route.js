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
    .select("playerId status score answers quizProgress duration startedAt gameVersion rpgProgress characterSnapshot")
      .lean();
    const sessionByPlayer = new Map(
      sessions.map((session) => [String(session.playerId), session]),
    );

    return NextResponse.json(
      {
        players: players.map((player) => {
          const session = sessionByPlayer.get(String(player._id));
          const isQuiz = session?.gameVersion === "quiz-v3";
          const answers = isQuiz
            ? session?.quizProgress?.answers ?? []
            : session?.answers ?? [];
          const answered = answers.length;
          const correct =
            answers.filter((answer) => answer.isCorrect).length;
          return {
            playerCode: player.playerCode,
            fullName: player.fullName,
            className: player.className,
            createdAt: player.createdAt,
            expiresAt: player.expiresAt,
            status: session?.status ?? "no-session",
            score: session?.score ?? 0,
            duration: session?.duration ?? null,
            gameVersion: session?.gameVersion ?? "legacy-v1",
            accuracy:
              session?.gameVersion === "rpg-v2"
                ? null
                : answered
                  ? Math.round((correct / answered) * 100)
                  : 0,
            dataRisk: session?.rpgProgress?.dataRisk ?? null,
            protectionScore:
              session?.rpgProgress?.protectionScore ?? null,
            evidenceCount:
              session?.rpgProgress?.evidenceInventory?.length ?? 0,
            character: session?.characterSnapshot
              ? {
                  characterName: session.characterSnapshot.characterName,
                  persona: session.characterSnapshot.persona,
                }
              : session?.characterId ?? null,
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
