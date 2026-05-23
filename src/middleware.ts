import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "smart-step-dev-secret-change-me"
);

async function verifyCookie(request: NextRequest, cookieName: string) {
  const token = request.cookies.get(cookieName)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { role?: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && pathname !== "/login/admin") {
    const session = await verifyCookie(request, "ssa_admin");
    if (!session || session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login/admin", request.url));
    }
    response.headers.set("Cache-Control", "no-store");
  }

  if (pathname.startsWith("/teacher") && pathname !== "/login/teacher") {
    const session = await verifyCookie(request, "ssa_teacher");
    if (!session || session.role !== "TEACHER") {
      return NextResponse.redirect(new URL("/login/teacher", request.url));
    }
    response.headers.set("Cache-Control", "no-store");
  }

  if (pathname.startsWith("/student") && pathname !== "/login/student") {
    const session = await verifyCookie(request, "ssa_student");
    if (!session || session.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/login/student", request.url));
    }
    response.headers.set("Cache-Control", "no-store");
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*"],
};
