import { NextRequest } from "next/server";
import { getAdminSession, hashPassword } from "@/lib/auth";
import { jsonError, jsonOk, handleZodError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { teacherSchema } from "@/lib/validators";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);
  const { id } = await params;

  try {
    const body = teacherSchema.partial().parse(await req.json());
    const teacher = await prisma.teacher.findUnique({ where: { id }, include: { user: true } });
    if (!teacher) return jsonError("Teacher not found", 404);

    await prisma.user.update({
      where: { id: teacher.userId },
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email || undefined,
        ...(body.password ? { passwordHash: await hashPassword(body.password) } : {}),
      },
    });

    await prisma.teacher.update({
      where: { id },
      data: {
        subject: body.subject,
        qualification: body.qualification,
        experience: body.experience,
        bio: body.bio,
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

  const teacher = await prisma.teacher.findUnique({ where: { id } });
  if (!teacher) return jsonError("Not found", 404);

  await prisma.user.delete({ where: { id: teacher.userId } });
  return jsonOk({ ok: true });
}
