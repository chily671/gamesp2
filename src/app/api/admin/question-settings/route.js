import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import GameSettings from "@/models/GameSettings";
import QuizQuestion from "@/models/QuizQuestion";
import {
  getAdminCookieName,
  isAdminAuthConfigured,
  isAdminCookieValid,
} from "@/lib/admin/auth";

function authorize(request) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { error: "Khu vực quản trị chưa được cấu hình đầy đủ." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
  if (!isAdminCookieValid(request.cookies.get(getAdminCookieName())?.value)) {
    return NextResponse.json(
      { error: "Cần đăng nhập quản trị." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }
  return null;
}

function handleError(error, operation) {
  if (error?.name === "ValidationError" || error?.name === "CastError") {
    return NextResponse.json(
      { error: "Số câu hỏi không hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
  console.error(`${operation} question settings failed:`, error?.name ?? "Unknown error");
  return NextResponse.json(
    { error: "Không thể lưu cài đặt số câu hỏi." },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET(request) {
  const authError = authorize(request);
  if (authError) return authError;

  try {
    await connectToDatabase();
    const [settings, activeQuestionCount] = await Promise.all([
      GameSettings.findById("default").select("questionCount").lean(),
      QuizQuestion.countDocuments({ isActive: true }),
    ]);
    return NextResponse.json(
      {
        questionCount: settings?.questionCount ?? 4,
        activeQuestionCount,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return handleError(error, "Loading");
  }
}

export async function PATCH(request) {
  const authError = authorize(request);
  if (authError) return authError;

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Dữ liệu cài đặt không hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload) ||
    Object.keys(payload).length !== 1 ||
    !Number.isInteger(payload.questionCount) ||
    payload.questionCount < 1 ||
    payload.questionCount > 1000
  ) {
    return NextResponse.json(
      { error: "Số câu mỗi ván phải là số nguyên dương." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    await connectToDatabase();
    const activeQuestionCount = await QuizQuestion.countDocuments({
      isActive: true,
    });
    if (payload.questionCount > activeQuestionCount) {
      return NextResponse.json(
        {
          error: `Chỉ có ${activeQuestionCount} câu hỏi đang hoạt động.`,
        },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    const settings = await GameSettings.findByIdAndUpdate(
      "default",
      { $set: { questionCount: payload.questionCount } },
      { upsert: true, returnDocument: "after", runValidators: true },
    ).lean();

    return NextResponse.json(
      {
        questionCount: settings.questionCount,
        activeQuestionCount,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return handleError(error, "Updating");
  }
}
