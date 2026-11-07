import { NextResponse } from "next/server";
import CharacterProfile from "@/models/CharacterProfile";
import Mission from "@/models/Mission";
import connectToDatabase from "@/lib/mongodb";
import {
  getAdminCookieName,
  isAdminAuthConfigured,
  isAdminCookieValid,
} from "@/lib/admin/auth";

export async function PATCH(request, context) {
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

  const { kind, code } = await context.params;
  const model =
    kind === "profiles"
      ? CharacterProfile
      : kind === "missions"
        ? Mission
        : null;
  const codeField =
    kind === "profiles"
      ? "characterCode"
      : kind === "missions"
        ? "missionCode"
        : null;

  if (!model || !codeField || !/^[A-Z0-9-]{1,40}$/.test(code)) {
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

  if (typeof payload?.isActive !== "boolean") {
    return NextResponse.json(
      { error: "Trạng thái phải là bật hoặc tắt." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    await connectToDatabase();
    const updated = await model.findOneAndUpdate(
      { [codeField]: code },
      { $set: { isActive: payload.isActive } },
      { new: true, runValidators: true },
    )
      .select(`${codeField} isActive`)
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
    console.error("Updating admin content failed:", error?.name ?? "Unknown error");
    return NextResponse.json(
      { error: "Không thể cập nhật nội dung." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
