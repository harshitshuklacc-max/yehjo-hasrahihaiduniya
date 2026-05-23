import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { jsonError, jsonOk, handleZodError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { timetableSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);
  const batchId = req.nextUrl.searchParams.get("batchId");
  if (!batchId) return jsonError("batchId required");

  const slots = await prisma.timetableSlot.findMany({
    where: { batchId },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });
  return jsonOk(slots);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const body = timetableSchema.parse(await req.json());
    await prisma.timetableSlot.deleteMany({ where: { batchId: body.batchId } });
    await prisma.timetableSlot.createMany({ data: body.slots.map((s) => ({ ...s, batchId: body.batchId })) });
    return jsonOk({ ok: true });
  } catch (e) {
    return handleZodError(e);
  }
}
