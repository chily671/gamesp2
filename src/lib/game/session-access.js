import GameSession from "@/models/GameSession";
import connectToDatabase from "@/lib/mongodb";
import { hashSessionToken } from "@/lib/utils/session-token";

export function getSessionToken(request) {
  const token = request.cookies.get("data-trap-session")?.value;

  if (
    typeof token !== "string" ||
    token.length !== 43 ||
    [...token].some(
      (character) =>
        !(
          (character >= "a" && character <= "z") ||
          (character >= "A" && character <= "Z") ||
          (character >= "0" && character <= "9") ||
          character === "_" ||
          character === "-"
        ),
    )
  ) {
    return null;
  }

  return token;
}

export async function findCurrentSession(token) {
  await connectToDatabase();
  return GameSession.findOne({
    sessionCodeHash: hashSessionToken(token),
    retentionExpiresAt: { $gt: new Date() },
  });
}

export function publicMission(mission) {
  return {
    missionCode: mission.missionCode,
    stage: mission.stage,
    title: mission.title,
    subtitle: mission.subtitle,
    story: mission.story,
    scenario: mission.scenario,
    interactionType: mission.interactionType,
    answerMode: mission.answerMode,
    interactionPrompt: mission.interactionPrompt,
    options: mission.options,
    hasLegalReviewNotice: mission.legalReviewRequired,
  };
}

export function unauthorizedResponse(NextResponse) {
  return NextResponse.json(
    { error: "Phiên chơi không hợp lệ hoặc đã hết hạn." },
    { status: 401, headers: { "Cache-Control": "no-store" } },
  );
}
