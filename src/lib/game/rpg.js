const DECISION_EFFECTS = {
  "verify-source": { dataRiskDelta: -5, protectionDelta: 15 },
  "report-and-block": { dataRiskDelta: -10, protectionDelta: 10 },
  "hide-public-traces": { dataRiskDelta: -10, protectionDelta: 15 },
  "revoke-permission": { dataRiskDelta: -15, protectionDelta: 15 },
  "ask-trusted-adult": { dataRiskDelta: -5, protectionDelta: 10 },
  "share-code": { dataRiskDelta: 25, protectionDelta: -15 },
};

const STAGE_THREE_ACTIONS = [
  {
    id: "verify-source",
    label: "Tự xác minh qua kênh chính thức",
    detail: "Mở ứng dụng/trang chính thức độc lập với tin nhắn.",
  },
  {
    id: "report-and-block",
    label: "Chặn và báo cáo tài khoản",
    detail: "Ngăn liên hệ tiếp tục và gửi báo cáo tới nền tảng.",
  },
  {
    id: "hide-public-traces",
    label: "Ẩn hoặc gỡ dấu vết đã phát hiện",
    detail: "Giới hạn người xem bài đăng, ảnh hoặc thông tin vị trí.",
    requiresEvidence: true,
  },
  {
    id: "revoke-permission",
    label: "Thu hồi quyền ứng dụng quá rộng",
    detail: "Tắt quyền đã cấp và rà soát dữ liệu ứng dụng lưu.",
    requiresBroadPermission: true,
  },
  {
    id: "ask-trusted-adult",
    label: "Nhờ người lớn đáng tin cậy hỗ trợ",
    detail: "Cùng kiểm tra sự cố và chọn bước xử lý phù hợp.",
  },
  {
    id: "share-code",
    label: "Gửi mã xác minh theo yêu cầu trong tin nhắn",
    detail: "Tin nhắn có vẻ khẩn cấp nhưng chưa được xác minh.",
    unsafe: true,
  },
];

export function clampScore(value) {
  return Math.max(0, Math.min(100, value));
}

export function createCharacterSnapshot(character) {
  const snapshot = { ...character };
  delete snapshot._id;
  delete snapshot.createdAt;
  delete snapshot.updatedAt;
  delete snapshot.__v;
  return snapshot;
}

export function getInitialRpgProgress(character) {
  return {
    currentStage: 1,
    dataRisk: clampScore(
      (character.digitalFootprint?.length ?? 0) * 4 +
        (character.riskFactors?.length ?? 0) * 4,
    ),
    protectionScore: 0,
    evidenceInventory: [],
    discoveredInteractables: [],
    storyFlags: [],
    decisions: [],
  };
}

export function getVisibleArtifacts(character, storyFlags) {
  return character.storyline.stage02.artifacts.filter(
    (artifact) =>
      artifact.condition === "always" ||
      storyFlags.includes(
        artifact.condition === "broad-permission"
          ? "permission-broad"
          : "permission-limited",
      ),
  );
}

export function getAvailableStageThreeActions(progress) {
  return STAGE_THREE_ACTIONS.filter(
    (action) =>
      (!action.requiresEvidence || progress.evidenceInventory.length > 0) &&
      (!action.requiresBroadPermission ||
        progress.storyFlags.includes("permission-broad")),
  ).map(({ id, label, detail, unsafe = false }) => ({
    id,
    label,
    detail,
    unsafe,
  }));
}

export function getDecisionEffect(actionId) {
  return DECISION_EFFECTS[actionId] ?? null;
}

export function getPublicRpgState(gameSession, character) {
  const progress = gameSession.rpgProgress;
  const stage = progress.currentStage;
  const state = {
    stage,
    dataRisk: progress.dataRisk,
    protectionScore: progress.protectionScore,
    evidenceInventory: progress.evidenceInventory,
    guardian: character.storyline.guardian[
      stage === 1 ? "stage01" : stage === 2 ? "stage02" : "stage03"
    ],
    evidence: character.storyline.stage02.artifacts
      .filter((artifact) =>
        progress.evidenceInventory.includes(artifact.evidenceId),
      )
      .map((artifact) => ({
        title: artifact.title,
        body: artifact.body,
        evidenceId: artifact.evidenceId,
      })),
  };

  if (stage === 1) {
    state.opening = character.storyline.opening;
    state.stage01 = {
      ...character.storyline.stage01,
      choices: [
        {
          id: "limit-permission",
          label: "Chỉ cho phép dữ liệu cần thiết",
          detail: character.storyline.stage01.limitedAction,
        },
        {
          id: "grant-broad-access",
          label: "Cấp quyền truy cập rộng",
          detail: character.storyline.stage01.broadAction,
        },
      ],
    };
  }

  if (stage === 2) {
    const discovered = new Set(progress.discoveredInteractables);
    const artifacts = getVisibleArtifacts(
      character,
      progress.storyFlags,
    ).map((artifact) => ({
      id: artifact.id,
      title: artifact.title,
      discovered: discovered.has(artifact.id),
      body: discovered.has(artifact.id) ? artifact.body : null,
      evidenceId: discovered.has(artifact.id) ? artifact.evidenceId : null,
    }));
    state.stage02 = {
      prompt: "Mở các mục trên điện thoại để kiểm tra dấu vết và thu thập bằng chứng.",
      artifacts,
      minimumEvidence: 2,
      canAdvance: progress.evidenceInventory.length >= 2,
    };
  }

  if (stage === 3) {
    state.stage03 = {
      incident: character.storyline.stage03.incident,
      choices: getAvailableStageThreeActions(progress),
      maximumActions: 3,
    };
  }

  return state;
}

export function buildRpgEnding(character, endingId) {
  return {
    id: endingId,
    narrative:
      endingId === "contained"
        ? character.storyline.stage03.safeEnding
        : character.storyline.stage03.exposedEnding,
  };
}
