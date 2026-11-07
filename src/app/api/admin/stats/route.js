import { NextResponse } from "next/server";
import CharacterProfile from "@/models/CharacterProfile";
import GameSession from "@/models/GameSession";
import Mission from "@/models/Mission";
import Player from "@/models/Player";
import connectToDatabase from "@/lib/mongodb";
import {
  getAdminCookieName,
  isAdminAuthConfigured,
  isAdminCookieValid,
} from "@/lib/admin/auth";

function isAuthorized(request) {
  return isAdminCookieValid(
    request.cookies.get(getAdminCookieName())?.value,
  );
}

export async function GET(request) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { error: "Khu vực quản trị chưa được cấu hình đầy đủ." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Cần đăng nhập quản trị." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    await connectToDatabase();
    const [players, sessions, profiles, missions, commonMisses] =
      await Promise.all([
        Player.countDocuments({ expiresAt: { $gt: new Date() } }),
        GameSession.aggregate([
          { $match: { retentionExpiresAt: { $gt: new Date() } } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              completed: {
                $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
              },
              expired: {
                $sum: { $cond: [{ $eq: ["$status", "expired"] }, 1, 0] },
              },
              rpgSessions: {
                $sum: {
                  $cond: [{ $eq: ["$gameVersion", "rpg-v2"] }, 1, 0],
                },
              },
              rpgCompleted: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$gameVersion", "rpg-v2"] },
                        { $eq: ["$status", "completed"] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
              averageDataRisk: {
                $avg: {
                  $cond: [
                    { $eq: ["$gameVersion", "rpg-v2"] },
                    "$rpgProgress.dataRisk",
                    null,
                  ],
                },
              },
              averageProtectionScore: {
                $avg: {
                  $cond: [
                    { $eq: ["$gameVersion", "rpg-v2"] },
                    "$rpgProgress.protectionScore",
                    null,
                  ],
                },
              },
              averageEvidenceCount: {
                $avg: {
                  $cond: [
                    { $eq: ["$gameVersion", "rpg-v2"] },
                    {
                      $size: {
                        $ifNull: ["$rpgProgress.evidenceInventory", []],
                      },
                    },
                    null,
                  ],
                },
              },
              averageScore: { $avg: "$score" },
              averageDuration: {
                $avg: {
                  $cond: [
                    { $eq: ["$status", "completed"] },
                    "$duration",
                    null,
                  ],
                },
              },
              totalAnswers: {
                $sum: { $size: { $ifNull: ["$answers", []] } },
              },
              correctAnswers: {
                $sum: {
                  $size: {
                    $filter: {
                      input: { $ifNull: ["$answers", []] },
                      as: "answer",
                      cond: { $eq: ["$$answer.isCorrect", true] },
                    },
                  },
                },
              },
              averageAccuracy: {
                $avg: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$status", "completed"] },
                        {
                          $gt: [
                            { $size: { $ifNull: ["$answers", []] } },
                            0,
                          ],
                        },
                      ],
                    },
                    {
                      $multiply: [
                        100,
                        {
                          $divide: [
                            {
                              $size: {
                                $filter: {
                                  input: { $ifNull: ["$answers", []] },
                                  as: "answer",
                                  cond: { $eq: ["$$answer.isCorrect", true] },
                                },
                              },
                            },
                            { $size: { $ifNull: ["$answers", []] } },
                          ],
                        },
                      ],
                    },
                    null,
                  ],
                },
              },
            },
          },
        ]),
        CharacterProfile.find()
          .select("characterCode characterName persona isActive")
          .sort({ characterCode: 1 })
          .lean(),
        Mission.find()
          .select("missionCode stage title isActive legalReviewRequired")
          .sort({ stage: 1 })
          .lean(),
        GameSession.aggregate([
          { $match: { retentionExpiresAt: { $gt: new Date() } } },
          { $unwind: "$answers" },
          { $match: { "answers.isCorrect": false } },
          { $group: { _id: "$answers.stage", count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } },
          { $limit: 4 },
        ]),
      ]);

    return NextResponse.json(
      {
        players,
        sessions: sessions[0] ?? {
          total: 0,
          completed: 0,
          expired: 0,
          averageScore: 0,
          averageDuration: 0,
          rpgSessions: 0,
          rpgCompleted: 0,
          averageDataRisk: 0,
          averageProtectionScore: 0,
          averageEvidenceCount: 0,
          totalAnswers: 0,
          correctAnswers: 0,
          averageAccuracy: 0,
        },
        rpg: {
          sessions: sessions[0]?.rpgSessions ?? 0,
          completed: sessions[0]?.rpgCompleted ?? 0,
          averageDataRisk: sessions[0]?.averageDataRisk ?? 0,
          averageProtectionScore:
            sessions[0]?.averageProtectionScore ?? 0,
          averageEvidenceCount: sessions[0]?.averageEvidenceCount ?? 0,
          stages: 3,
        },
        profiles,
        missions,
        questions: {
          total: missions.length,
          legalReviewRequired: missions.filter(
            (mission) => mission.legalReviewRequired,
          ).length,
        },
        commonMisses,
        sessionDurationMinutes: Number(
          process.env.SESSION_DURATION_MINUTES ?? 5,
        ),
        dataRetentionDays: Number(process.env.DATA_RETENTION_DAYS ?? 30),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Loading admin statistics failed:", error?.name ?? "Unknown error");
    return NextResponse.json(
      { error: "Không thể tải thống kê lúc này." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
