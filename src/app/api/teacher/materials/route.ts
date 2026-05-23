import { NextRequest } from "next/server";
import { getTeacherSession } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  batchId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  fileUrl: z.string().url().or(z.string().min(1)),
});

export async function GET() {
  const session = await getTeacherSession();
  if (!session?.teacherId) return jsonError("Unauthorized", 401);

  const items = await prisma.studyMaterial.findMany({
    where: { teacherId: session.teacherId },
    include: { batch: true },
    orderBy: { createdAt: "desc" },
  });
  return jsonOk(items);
}

export async function POST(req: NextRequest) {
  const session = await getTeacherSession();
  if (!session?.teacherId) return jsonError("Unauthorized", 401);

  try {
    const body = schema.parse(await req.json());
    const item = await prisma.studyMaterial.create({
      data: { ...body, teacherId: session.teacherId },
    });
    return jsonOk(item, 201);
  } catch (e) {
    return jsonError("Invalid data");
  }
}
