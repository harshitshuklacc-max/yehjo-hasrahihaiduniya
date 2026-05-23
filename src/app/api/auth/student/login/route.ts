import { NextRequest } from "next/server";
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
    const user = await loginByRole(body.identifier, body.password, "STUDENT");
    if (!user) return jsonError("Invalid student credentials", 401);

    const payload = await buildSessionPayload(user);
    const token = await createToken(payload);
    await setRoleSessionCookie("STUDENT", token);
    await logLoginActivity(user.id);

    return jsonOk({ user: { name: user.name, username: user.username } });
  } catch (e) {
    return handleZodError(e);
  }
}
