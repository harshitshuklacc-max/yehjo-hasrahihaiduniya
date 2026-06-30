import { NextRequest } from "next/server";
import { getAdminSession, hashPassword } from "@/lib/auth";
import { jsonError, jsonOk, handleZodError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { studentSchema } from "@/lib/validators";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);
  const { id } = await params;

  try {
    const body = studentSchema.partial().parse(await req.json());
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) return jsonError("Not found", 404);

    await prisma.user.update({
      where: { id: student.userId },
      data: {
        name: body.name,
        phone: body.phone,
        ...(body.password ? { passwordHash: await hashPassword(body.password) } : {}),
      },
    });

    await prisma.student.update({
      where: { id },
      data: {
        classLevel: body.classLevel,
        parentName: body.parentName,
        parentPhone: body.parentPhone,
        address: body.address,
      },
    });

    return jsonOk({ ok: true });
  } catch (e) {
    return handleZodError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);
  const { id } = await params;

  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) return jsonError("Not found", 404);

  await prisma.user.delete({ where: { id: student.userId } });
  return jsonOk({ ok: true });
}
