import { NextResponse } from "next/server";
import CharacterProfile from "@/models/CharacterProfile";
import Mission from "@/models/Mission";
import connectToDatabase from "@/lib/mongodb";
import GameSession from "@/models/GameSession";
import {
  getAdminCookieName,
  isAdminAuthConfigured,
  isAdminCookieValid,
} from "@/lib/admin/auth";
import {
  validateMission,
  validateProfile,
} from "@/lib/admin/content-validation";

function authorize(request) {
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
  return null;
}

function getContentTarget(kind) {
  if (kind === "profiles") {
    return { model: CharacterProfile, codeField: "characterCode" };
  }
  if (kind === "missions") {
    return { model: Mission, codeField: "missionCode" };
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
  const { kind, code } = await context.params;
  const target = getContentTarget(kind);

  if (!target || !/^[A-Z0-9-]{1,40}$/.test(code)) {
    return NextResponse.json(
      { error: "Đối tượng quản lý không hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    await connectToDatabase();
    const query = target.model.findOne({ [target.codeField]: code });
    if (kind === "missions") query.select("+correctAnswer");
    const entry = await query.lean();
    if (!entry) {
      return NextResponse.json(
        { error: "Không tìm thấy nội dung." },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }
    return NextResponse.json(
      { entry },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return handleContentError(error, "Loading");
  }
}

export async function PATCH(request, context) {
  const authError = authorize(request);
  if (authError) return authError;
  const { kind, code } = await context.params;
  const target = getContentTarget(kind);

  if (!target || !/^[A-Z0-9-]{1,40}$/.test(code)) {
    return NextResponse.json(
      { error: "Đối tượng quản lý không hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Dữ liệu cập nhật không hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    Object.keys(payload).length === 1 &&
    typeof payload.isActive === "boolean"
  ) {
    try {
      await connectToDatabase();
      const updated = await target.model
        .findOneAndUpdate(
          { [target.codeField]: code },
          { $set: { isActive: payload.isActive } },
          { new: true, runValidators: true },
        )
        .select(`${target.codeField} isActive`)
        .lean();

      if (!updated) {
        return NextResponse.json(
          { error: "Không tìm thấy nội dung." },
          { status: 404, headers: { "Cache-Control": "no-store" } },
        );
      }

      return NextResponse.json(
        { code, isActive: updated.isActive },
        { headers: { "Cache-Control": "no-store" } },
      );
    } catch (error) {
      return handleContentError(error, "Updating");
    }
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
    const value = validation.value;
    const payloadCode =
      kind === "profiles" ? value.characterCode : value.missionCode;
    if (payloadCode !== code) {
      return NextResponse.json(
        { error: "Không thể thay đổi mã định danh hiện có." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }
    delete value[kind === "profiles" ? "characterCode" : "missionCode"];
    const updated = await target.model.findOneAndUpdate(
      { [target.codeField]: code },
      { $set: value },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Không tìm thấy nội dung." },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      { code, updated: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return handleContentError(error, "Updating");
  }
}

export async function DELETE(request, context) {
  const authError = authorize(request);
  if (authError) return authError;
  const { kind, code } = await context.params;
  const target = getContentTarget(kind);

  if (!target || !/^[A-Z0-9-]{1,40}$/.test(code)) {
    return NextResponse.json(
      { error: "Đối tượng quản lý không hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    await connectToDatabase();
    if (kind === "profiles") {
      const profile = await CharacterProfile.findOne({
        characterCode: code,
      }).select("_id");
      if (!profile) {
        return NextResponse.json(
          { error: "Không tìm thấy hồ sơ." },
          { status: 404, headers: { "Cache-Control": "no-store" } },
        );
      }
      const inUse = await GameSession.exists({
        characterId: profile._id,
        retentionExpiresAt: { $gt: new Date() },
      });
      if (inUse) {
        return NextResponse.json(
          { error: "Không thể xóa hồ sơ đang được phiên chơi lưu trữ sử dụng." },
          { status: 409, headers: { "Cache-Control": "no-store" } },
        );
      }
    } else {
      const activeSession = await GameSession.exists({
        status: "in_progress",
        retentionExpiresAt: { $gt: new Date() },
      });
      if (activeSession) {
        return NextResponse.json(
          { error: "Hãy chờ các phiên chơi đang diễn ra kết thúc trước khi xóa nhiệm vụ." },
          { status: 409, headers: { "Cache-Control": "no-store" } },
        );
      }
    }

    const deleted = await target.model.deleteOne({
      [target.codeField]: code,
    });
    if (deleted.deletedCount === 0) {
      return NextResponse.json(
        { error: "Không tìm thấy nội dung." },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }
    return NextResponse.json(
      { code, deleted: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return handleContentError(error, "Deleting");
  }
}
