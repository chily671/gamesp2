import { NextResponse } from "next/server";
import {
  createAdminCookieValue,
  getAdminCookieDuration,
  getAdminCookieName,
  isAdminAuthConfigured,
  safeSecretMatch,
  verifyAdminPassword,
} from "@/lib/admin/auth";

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Thông tin xác thực không hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { error: "Khu vực quản trị chưa được cấu hình đầy đủ." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (
    typeof payload?.username !== "string" ||
    typeof payload?.password !== "string" ||
    payload.username.length > 64 ||
    payload.password.length > 128 ||
    !safeSecretMatch(payload.username, process.env.ADMIN_USERNAME) ||
    !(await verifyAdminPassword(payload.password))
  ) {
    return NextResponse.json(
      { error: "Không thể xác thực quyền quản trị." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const response = NextResponse.json(
      { authenticated: true },
      { headers: { "Cache-Control": "no-store" } },
    );
    response.cookies.set({
      name: getAdminCookieName(),
      value: createAdminCookieValue(),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/admin",
      maxAge: getAdminCookieDuration(),
    });
    return response;
  } catch (error) {
    console.error("Admin authentication configuration error:", error.code);
    return NextResponse.json(
      { error: "Khu vực quản trị chưa được cấu hình đầy đủ." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
