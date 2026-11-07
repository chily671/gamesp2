export function getAchievement(score, completedStages, gameVersion = "legacy-v1") {
  if (gameVersion === "quiz-v3") {
    const averagePoints = completedStages > 0 ? score / completedStages : 0;
    if (completedStages > 0 && averagePoints >= 85) {
      return {
        code: "PRIVACY_ANALYST",
        title: "PRIVACY ANALYST",
        description: "Đã nhận diện tín hiệu rủi ro và chọn cách xử lý phù hợp.",
      };
    }
    if (completedStages > 0 && averagePoints >= 60) {
      return {
        code: "DATA_GUARDIAN",
        title: "DATA GUARDIAN",
        description: "Đã vận dụng nhiều lớp bảo vệ dữ liệu cá nhân.",
      };
    }
    if (completedStages > 0) {
      return {
        code: "RISK_SCOUT",
        title: "RISK SCOUT",
        description: "Đã bắt đầu phân tích các tình huống dữ liệu số.",
      };
    }
    return {
      code: "DATA_OBSERVER",
      title: "DATA OBSERVER",
      description: "Mỗi quyết định đều giúp hiểu rõ hơn về dữ liệu.",
    };
  }

  if (gameVersion === "rpg-v2") {
    if (completedStages === 3 && score >= 40) {
      return {
        code: "RISK_CONTROLLER",
        title: "RISK CONTROLLER",
        description: "Đã khám phá dấu vết và chủ động xử lý rủi ro.",
      };
    }
    if (completedStages >= 2 && score >= 20) {
      return {
        code: "EVIDENCE_INVESTIGATOR",
        title: "EVIDENCE INVESTIGATOR",
        description: "Đã thu thập bằng chứng và kết nối các dấu vết.",
      };
    }
    if (score >= 5) {
      return {
        code: "SIGNAL_SCOUT",
        title: "SIGNAL SCOUT",
        description: "Đã bắt đầu khám phá dấu vết số.",
      };
    }
    return {
      code: "DATA_OBSERVER",
      title: "DATA OBSERVER",
      description: "Mỗi quyết định đều giúp hiểu rõ hơn về dữ liệu.",
    };
  }

  if (completedStages === 4 && score >= 360) {
    return {
      code: "DIGITAL_IDENTITY_MASTER",
      title: "DIGITAL IDENTITY MASTER",
      description: "Bảo vệ danh tính với sự chính xác vượt trội.",
    };
  }
  if (completedStages === 4 && score >= 280) {
    return {
      code: "DATA_GUARDIAN",
      title: "DATA GUARDIAN",
      description: "Hoàn thành mọi nhiệm vụ và bảo vệ danh tính.",
    };
  }
  if (score >= 200) {
    return {
      code: "PRIVACY_DEFENDER",
      title: "PRIVACY DEFENDER",
      description: "Đã chủ động giảm nhiều rủi ro dữ liệu.",
    };
  }
  if (score >= 100) {
    return {
      code: "TRAP_DETECTOR",
      title: "TRAP DETECTOR",
      description: "Nhận diện được những chiếc bẫy đầu tiên.",
    };
  }
  return {
    code: "DATA_ROOKIE",
    title: "DATA ROOKIE",
    description: "Mỗi hành trình bảo vệ dữ liệu đều bắt đầu bằng một lựa chọn.",
  };
}
