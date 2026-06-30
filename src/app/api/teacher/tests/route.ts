import { NextRequest } from "next/server";
import { getTeacherSession } from "@/lib/auth";
import { jsonError, jsonOk, handleZodError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { testSchema } from "@/lib/validators";

export async function GET() {
  const session = await getTeacherSession();
  if (!session?.teacherId) return jsonError("Unauthorized", 401);

  const tests = await prisma.testSchedule.findMany({
    where: { teacherId: session.teacherId },
    orderBy: { testDate: "asc" },
  });
  return jsonOk(tests);
}

export async function POST(req: NextRequest) {
  const session = await getTeacherSession();
  if (!session?.teacherId) return jsonError("Unauthorized", 401);

  try {
    const body = testSchema.parse(await req.json());
    const test = await prisma.testSchedule.create({
      data: {
        classLevel: body.classLevel,
        teacherId: session.teacherId,
        subject: body.subject,
        syllabus: body.syllabus,
        testDate: new Date(body.testDate),
        startTime: body.startTime,
        endTime: body.endTime,
        instructions: body.instructions,
      },
    });
    return jsonOk(test, 201);
  } catch (e) {
    return handleZodError(e);
  }
}
