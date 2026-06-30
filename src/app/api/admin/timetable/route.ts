import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { jsonError, jsonOk, handleZodError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { timetableSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);
  const classLevel = req.nextUrl.searchParams.get("classLevel");
  if (!classLevel) return jsonError("classLevel required");

  const slots = await prisma.timetableSlot.findMany({
    where: { classLevel },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });
  return jsonOk(slots);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const body = timetableSchema.parse(await req.json());
    await prisma.timetableSlot.deleteMany({ where: { classLevel: body.classLevel } });
    await prisma.timetableSlot.createMany({
      data: body.slots.map((s) => ({ ...s, classLevel: body.classLevel })),
    });
    return jsonOk({ ok: true });
  } catch (e) {
    return handleZodError(e);
  }
}
