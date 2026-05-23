import { clearRoleSessionCookie } from "@/lib/auth";
import { jsonOk } from "@/lib/api-helpers";

export async function POST() {
  await clearRoleSessionCookie("STUDENT");
  return jsonOk({ ok: true });
}
