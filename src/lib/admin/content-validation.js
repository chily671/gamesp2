const INTERACTION_TYPES = ["permissions", "data-review", "chat", "final-plan"];
const ANSWER_MODES = ["single", "multiple"];

function isText(value, maxLength = 4000) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= maxLength
  );
}

function isStringList(value, maxItems = 50) {
  return (
    Array.isArray(value) &&
    value.length <= maxItems &&
    value.every((item) => typeof item === "string" && item.length <= 500)
  );
}

export function validateProfile(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { error: "Dữ liệu hồ sơ không hợp lệ." };
  }

  const textFields = [
    "characterCode",
    "characterName",
    "persona",
    "gender",
    "className",
    "school",
    "address",
    "housing",
    "relationshipStatus",
  ];
  if (
    textFields.some((field) => !isText(payload[field], field === "characterCode" ? 40 : 200)) ||
    !/^[A-Z0-9-]{1,40}$/.test(payload.characterCode) ||
    !Number.isInteger(payload.age) ||
    payload.age < 1 ||
    payload.age > 120 ||
    !isStringList(payload.familyMembers) ||
    !payload.contact ||
    !isText(payload.contact.phone, 100) ||
    !isText(payload.contact.email, 200) ||
    !payload.socialAccounts ||
    !isText(payload.socialAccounts.facebookUsername, 100) ||
    !isText(payload.socialAccounts.simulatedPassword, 200) ||
    !payload.financialInfo ||
    !Number.isFinite(payload.financialInfo.simulatedBalance) ||
    payload.financialInfo.simulatedBalance < 0 ||
    !isText(payload.financialInfo.currencyLabel, 100) ||
    !payload.lifestyle ||
    !isStringList(payload.lifestyle.hobbies) ||
    !isStringList(payload.lifestyle.habits) ||
    !isStringList(payload.lifestyle.frequentPlaces) ||
    !isText(payload.lifestyle.summary) ||
    !isStringList(payload.riskFactors) ||
    !isStringList(payload.digitalFootprint)
  ) {
    return { error: "Vui lòng kiểm tra các trường bắt buộc và định dạng hồ sơ." };
  }

  return {
    value: {
      characterCode: payload.characterCode,
      characterName: payload.characterName.trim(),
      persona: payload.persona.trim(),
      age: payload.age,
      gender: payload.gender.trim(),
      className: payload.className.trim(),
      school: payload.school.trim(),
      address: payload.address.trim(),
      housing: payload.housing.trim(),
      familyMembers: payload.familyMembers.map((item) => item.trim()).filter(Boolean),
      contact: {
        phone: payload.contact.phone.trim(),
        email: payload.contact.email.trim(),
        demoOnly: true,
      },
      socialAccounts: {
        facebookUsername: payload.socialAccounts.facebookUsername.trim(),
        simulatedPassword: payload.socialAccounts.simulatedPassword.trim(),
        demoOnly: true,
      },
      financialInfo: {
        simulatedBalance: payload.financialInfo.simulatedBalance,
        currencyLabel: payload.financialInfo.currencyLabel.trim(),
        demoOnly: true,
      },
      relationshipStatus: payload.relationshipStatus.trim(),
      lifestyle: {
        hobbies: payload.lifestyle.hobbies.map((item) => item.trim()).filter(Boolean),
        habits: payload.lifestyle.habits.map((item) => item.trim()).filter(Boolean),
        frequentPlaces: payload.lifestyle.frequentPlaces.map((item) => item.trim()).filter(Boolean),
        summary: payload.lifestyle.summary.trim(),
      },
      riskFactors: payload.riskFactors.map((item) => item.trim()).filter(Boolean),
      digitalFootprint: payload.digitalFootprint.map((item) => item.trim()).filter(Boolean),
      isActive: payload.isActive !== false,
      isDemoOnly: true,
    },
  };
}

export function validateMission(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { error: "Dữ liệu nhiệm vụ không hợp lệ." };
  }

  const textFields = [
    "missionCode",
    "title",
    "subtitle",
    "story",
    "scenario",
    "interactionPrompt",
    "explanation",
    "lesson",
    "legalBasis",
  ];
  const options = payload.options;
  const optionIds = Array.isArray(options) ? options.map((option) => option?.id) : [];
  const correctAnswers = payload.correctAnswer;

  if (
    !isText(payload.missionCode, 40) ||
    !/^[A-Z0-9-]{1,40}$/.test(payload.missionCode) ||
    !Number.isInteger(payload.stage) ||
    payload.stage < 1 ||
    payload.stage > 4 ||
    textFields.slice(1).some((field) => !isText(payload[field])) ||
    !INTERACTION_TYPES.includes(payload.interactionType) ||
    !ANSWER_MODES.includes(payload.answerMode) ||
    !Array.isArray(options) ||
    options.length < 2 ||
    options.length > 30 ||
    options.some(
      (option) =>
        !option ||
        !/^[a-zA-Z0-9_-]{1,50}$/.test(option.id) ||
        !isText(option.label, 300) ||
        !isText(option.detail, 1000),
    ) ||
    new Set(optionIds).size !== optionIds.length ||
    !Array.isArray(correctAnswers) ||
    correctAnswers.length === 0 ||
    new Set(correctAnswers).size !== correctAnswers.length ||
    correctAnswers.some((answer) => !optionIds.includes(answer)) ||
    (payload.answerMode === "single" && correctAnswers.length !== 1) ||
    typeof payload.legalReviewRequired !== "boolean"
  ) {
    return {
      error:
        "Vui lòng kiểm tra nội dung, lựa chọn và đáp án. Mỗi đáp án đúng phải khớp với một lựa chọn.",
    };
  }

  return {
    value: {
      missionCode: payload.missionCode,
      stage: payload.stage,
      title: payload.title.trim(),
      subtitle: payload.subtitle.trim(),
      story: payload.story.trim(),
      scenario: payload.scenario.trim(),
      interactionType: payload.interactionType,
      answerMode: payload.answerMode,
      interactionPrompt: payload.interactionPrompt.trim(),
      options: options.map((option) => ({
        id: option.id,
        label: option.label.trim(),
        detail: option.detail.trim(),
      })),
      correctAnswer: correctAnswers,
      explanation: payload.explanation.trim(),
      lesson: payload.lesson.trim(),
      legalBasis: payload.legalBasis.trim(),
      legalReviewRequired: payload.legalReviewRequired,
      isActive: payload.isActive !== false,
    },
  };
}
