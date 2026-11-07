export function getAchievement(score, completedStages) {
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
