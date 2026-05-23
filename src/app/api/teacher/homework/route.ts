import { NextRequest } from "next/server";
import { getTeacherSession } from "@/lib/auth";
import { jsonError, jsonOk, handleZodError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { homeworkSchema } from "@/lib/validators";

export async function GET() {
  const session = await getTeacherSession();
  if (!session?.teacherId) return jsonError("Unauthorized", 401);

  const items = await prisma.homework.findMany({
    where: { teacherId: session.teacherId },
    include: { batch: true },
    orderBy: { dueDate: "asc" },
  });
  return jsonOk(items);
}

export async function POST(req: NextRequest) {
  const session = await getTeacherSession();
  if (!session?.teacherId) return jsonError("Unauthorized", 401);

  try {
    const body = homeworkSchema.parse(await req.json());
    const link = await prisma.batchTeacher.findFirst({
      where: { batchId: body.batchId, teacherId: session.teacherId },
    });
    if (!link) return jsonError("Not assigned to this batch", 403);

    const hw = await prisma.homework.create({
      data: {
        batchId: body.batchId,
        teacherId: session.teacherId,
        title: body.title,
        description: body.description,
        dueDate: new Date(body.dueDate),
        attachments: JSON.stringify(body.attachments || []),
      },
    });
    return jsonOk(hw, 201);
  } catch (e) {
    return handleZodError(e);
  }
}
