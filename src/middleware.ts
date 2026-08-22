import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { COOKIE } from "@/server/auth/constants";

const PUBLIC = new Set([
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]);

function secret() {
  const raw = process.env.SESSION_SECRET ?? "";
  return new TextEncoder().encode(raw);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE)?.value;
  let session: { onboarded?: boolean } | null = null;
  if (token && process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32) {
    try {
      const { payload } = await jwtVerify(token, secret());
      session = { onboarded: Boolean(payload.onboarded) };
    } catch {
      session = null;
    }
  }

  const isPublic = PUBLIC.has(pathname);
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (session && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(
      new URL(session.onboarded ? "/dashboard" : "/onboarding", req.url),
    );
  }
  if (session && !session.onboarded && pathname !== "/onboarding" && !isPublic) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
  if (session?.onboarded && pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
