import { NextRequest } from "next/server";
import { getTeacherSession } from "@/lib/auth";
import { jsonError, jsonOk, handleZodError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { materialSchema } from "@/lib/validators";

export async function GET() {
  const session = await getTeacherSession();
  if (!session?.teacherId) return jsonError("Unauthorized", 401);

  const items = await prisma.studyMaterial.findMany({
    where: { teacherId: session.teacherId },
    orderBy: { createdAt: "desc" },
  });
  return jsonOk(items);
}

export async function POST(req: NextRequest) {
  const session = await getTeacherSession();
  if (!session?.teacherId) return jsonError("Unauthorized", 401);

  try {
    const body = materialSchema.parse(await req.json());
    const item = await prisma.studyMaterial.create({
      data: { ...body, teacherId: session.teacherId },
    });
    return jsonOk(item, 201);
  } catch (e) {
    return handleZodError(e);
  }
}
