import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import type { UserRole } from "@prisma/client";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "smart-step-dev-secret-change-me"
);

export const ADMIN_COOKIE = "ssa_admin";
export const TEACHER_COOKIE = "ssa_teacher";
export const STUDENT_COOKIE = "ssa_student";

export type SessionPayload = {
  userId: string;
  role: UserRole;
  username: string;
  name: string;
  teacherId?: string;
  studentId?: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createToken(payload: SessionPayload) {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

async function getSessionFromCookie(name: string): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(name)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getAdminSession() {
  const session = await getSessionFromCookie(ADMIN_COOKIE);
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

export async function getTeacherSession() {
  const session = await getSessionFromCookie(TEACHER_COOKIE);
  if (!session || session.role !== "TEACHER") return null;
  return session;
}

export async function getStudentSession() {
  const session = await getSessionFromCookie(STUDENT_COOKIE);
  if (!session || session.role !== "STUDENT") return null;
  return session;
}

function cookieOptions(maxAge = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function setRoleSessionCookie(role: UserRole, token: string) {
  const cookieStore = await cookies();
  const name =
    role === "ADMIN" ? ADMIN_COOKIE : role === "TEACHER" ? TEACHER_COOKIE : STUDENT_COOKIE;
  cookieStore.set(name, token, cookieOptions());
}

export async function clearRoleSessionCookie(role: UserRole) {
  const cookieStore = await cookies();
  const name =
    role === "ADMIN" ? ADMIN_COOKIE : role === "TEACHER" ? TEACHER_COOKIE : STUDENT_COOKIE;
  cookieStore.delete(name);
}

export async function loginByRole(identifier: string, password: string, role: UserRole) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: identifier }, { email: identifier }],
      role,
      isActive: true,
    },
    include: { teacher: true, student: true },
  });
  if (!user?.passwordHash) return null;
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;
  if (role === "STUDENT" && user.student?.isArchived) return null;
  return user;
}

export async function buildSessionPayload(user: {
  id: string;
  role: UserRole;
  username: string;
  name: string;
  teacher?: { id: string } | null;
  student?: { id: string } | null;
}): Promise<SessionPayload> {
  return {
    userId: user.id,
    role: user.role,
    username: user.username,
    name: user.name,
    teacherId: user.teacher?.id,
    studentId: user.student?.id,
  };
}

export async function logLoginActivity(userId: string, ip?: string, userAgent?: string) {
  await prisma.loginActivity.create({
    data: { userId, ip, userAgent },
  });
}
