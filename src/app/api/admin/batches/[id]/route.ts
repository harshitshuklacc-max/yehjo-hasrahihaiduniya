import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { jsonError, jsonOk, handleZodError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { batchSchema } from "@/lib/validators";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);
  const { id } = await params;

  try {
    const body = batchSchema.partial().parse(await req.json());
    await prisma.batch.update({
      where: { id },
      data: {
        name: body.name,
        classLevel: body.classLevel,
        stream: body.stream,
        timing: body.timing,
        capacity: body.capacity,
      },
    });

    if (body.teacherIds) {
      await prisma.batchTeacher.deleteMany({ where: { batchId: id } });
      await prisma.batchTeacher.createMany({
        data: body.teacherIds.map((teacherId) => ({ batchId: id, teacherId })),
      });
    }

    return jsonOk({ ok: true });
  } catch (e) {
    return handleZodError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);
  const { id } = await params;
  await prisma.batch.delete({ where: { id } });
  return jsonOk({ ok: true });
}
