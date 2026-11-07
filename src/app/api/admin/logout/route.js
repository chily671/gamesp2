import { NextResponse } from "next/server";
import { getAdminCookieName } from "@/lib/admin/auth";

export async function POST() {
  const response = NextResponse.json(
    { loggedOut: true },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set({
    name: getAdminCookieName(),
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/admin",
    maxAge: 0,
  });
  return response;
}
