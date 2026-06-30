import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { jsonError, jsonOk, handleZodError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { facultyShowcaseSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const { id } = await params;
    const body = facultyShowcaseSchema.partial().parse(await req.json());
    const item = await prisma.facultyShowcase.update({
      where: { id },
      data: {
        name: body.name,
        subject: body.subject,
        experience: body.experience,
        bio: body.bio,
        order: body.order,
        isActive: body.isActive,
      },
    });
    return jsonOk(item);
  } catch (e) {
    return handleZodError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  const { id } = await params;
  await prisma.facultyShowcase.delete({ where: { id } });
  return jsonOk({ ok: true });
}
