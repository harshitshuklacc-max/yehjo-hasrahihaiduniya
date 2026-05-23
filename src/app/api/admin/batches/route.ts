import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { jsonError, jsonOk, handleZodError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { batchSchema } from "@/lib/validators";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  const batches = await prisma.batch.findMany({
    include: {
      teachers: { include: { teacher: { include: { user: true } } } },
      _count: { select: { students: true } },
      timetable: true,
    },
    orderBy: { name: "asc" },
  });

  return jsonOk(batches);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const body = batchSchema.parse(await req.json());
    const batch = await prisma.batch.create({
      data: {
        name: body.name,
        classLevel: body.classLevel,
        stream: body.stream,
        timing: body.timing,
        capacity: body.capacity ?? 30,
        teachers: body.teacherIds?.length
          ? {
              create: body.teacherIds.map((teacherId) => ({ teacherId })),
            }
          : undefined,
      },
      include: { teachers: true },
    });
    return jsonOk(batch, 201);
  } catch (e) {
    return handleZodError(e);
  }
}
