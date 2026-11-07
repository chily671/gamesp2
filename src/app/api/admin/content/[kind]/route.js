import { NextResponse } from "next/server";
import CharacterProfile from "@/models/CharacterProfile";
import Mission from "@/models/Mission";
import connectToDatabase from "@/lib/mongodb";
import {
  getAdminCookieName,
  isAdminAuthConfigured,
  isAdminCookieValid,
} from "@/lib/admin/auth";
import {
  validateMission,
  validateProfile,
} from "@/lib/admin/content-validation";

function getModel(kind) {
  if (kind === "profiles") return CharacterProfile;
  if (kind === "missions") return Mission;
  return null;
}

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

function handleContentError(error, operation) {
  if (error?.code === 11000) {
    return NextResponse.json(
      { error: "Mã hoặc thứ tự đã được sử dụng." },
      { status: 409, headers: { "Cache-Control": "no-store" } },
    );
  }
  if (error?.name === "ValidationError" || error?.name === "CastError") {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ. Hãy kiểm tra các trường bắt buộc." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
  console.error(`${operation} admin content failed:`, error?.name ?? "Unknown error");
  return NextResponse.json(
    { error: "Không thể hoàn tất thao tác nội dung." },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET(request, context) {
  const authError = authorize(request);
  if (authError) return authError;

  const { kind } = await context.params;
  const model = getModel(kind);
  if (!model) {
    return NextResponse.json(
      { error: "Loại nội dung không hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    await connectToDatabase();
    const query =
      kind === "missions"
        ? model.find().select("+correctAnswer").sort({ stage: 1 })
        : model.find().sort({ characterCode: 1 });
    const entries = await query.lean();
    return NextResponse.json(
      { entries },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return handleContentError(error, "Loading");
  }
}

export async function POST(request, context) {
  const authError = authorize(request);
  if (authError) return authError;

  const { kind } = await context.params;
  const model = getModel(kind);
  if (!model) {
    return NextResponse.json(
      { error: "Loại nội dung không hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Dữ liệu gửi lên không hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const validation =
    kind === "profiles" ? validateProfile(payload) : validateMission(payload);
  if (validation.error) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    await connectToDatabase();
    const entry = await model.create(validation.value);
    return NextResponse.json(
      {
        code:
          kind === "profiles" ? entry.characterCode : entry.missionCode,
      },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return handleContentError(error, "Creating");
  }
}
