import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import {
  buildSessionPayload,
  createToken,
  logLoginActivity,
  loginByRole,
  setRoleSessionCookie,
} from "@/lib/auth";
import { jsonError, jsonOk, handleZodError } from "@/lib/api-helpers";
import { loginSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = loginSchema.parse(await req.json());
    const user = await loginByRole(body.identifier, body.password, "ADMIN");
    if (!user) return jsonError("Invalid admin credentials", 401);

    const payload = await buildSessionPayload(user);
    const token = await createToken(payload);
    await setRoleSessionCookie("ADMIN", token);

    try {
      await logLoginActivity(
        user.id,
        req.headers.get("x-forwarded-for") || undefined,
        req.headers.get("user-agent") || undefined
      );
    } catch {
      // Login log is optional — do not block sign-in
    }

    return jsonOk({ user: { name: user.name, username: user.username, role: user.role } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientInitializationError) {
      return jsonError(
        "Database not connected. Run: npx prisma db push && npm run db:seed",
        503
      );
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error:", e.code, e.message);
      return jsonError("Database error. Please run db push and seed.", 503);
    }
    return handleZodError(e);
  }
}
