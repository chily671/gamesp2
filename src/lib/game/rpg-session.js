import {
  findCurrentSession,
  getSessionCharacter,
  getSessionToken,
} from "@/lib/game/session-access";

export async function requireActiveRpgSession(request, NextResponse) {
  const token = getSessionToken(request);

  if (!token) {
    return {
      error: NextResponse.json(
        { error: "Phiên chơi không hợp lệ hoặc đã hết hạn." },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      ),
    };
  }

  const gameSession = await findCurrentSession(token);
  if (
    !gameSession ||
    gameSession.gameVersion !== "rpg-v2" ||
    gameSession.status !== "in_progress"
  ) {
    return {
      error: NextResponse.json(
        { error: "Không thể thực hiện thao tác trong phiên RPG này." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      ),
    };
  }

  const now = new Date();
  if (gameSession.expiresAt <= now) {
    gameSession.status = "expired";
    gameSession.completedAt = now;
    gameSession.duration = Math.max(
      0,
      Math.floor((now - gameSession.startedAt) / 1000),
    );
    await gameSession.save();
    return {
      error: NextResponse.json(
        { error: "Thời gian chơi đã hết." },
        { status: 410, headers: { "Cache-Control": "no-store" } },
      ),
    };
  }

  const character = await getSessionCharacter(gameSession);
  if (!character?.storyline || !gameSession.rpgProgress) {
    return {
      error: NextResponse.json(
        { error: "Phiên RPG chưa có đủ dữ liệu để tiếp tục." },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      ),
    };
  }

  return { gameSession, character };
}
