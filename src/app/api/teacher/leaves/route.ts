import { NextRequest } from "next/server";
import { getTeacherSession } from "@/lib/auth";
import { jsonError, jsonOk, handleZodError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { leaveSchema } from "@/lib/validators";

export async function GET() {
  const session = await getTeacherSession();
  if (!session?.teacherId) return jsonError("Unauthorized", 401);

  const leaves = await prisma.leaveRequest.findMany({
    where: { teacherId: session.teacherId },
    orderBy: { createdAt: "desc" },
  });
  return jsonOk(leaves);
}

export async function POST(req: NextRequest) {
  const session = await getTeacherSession();
  if (!session?.teacherId) return jsonError("Unauthorized", 401);

  try {
    const body = leaveSchema.parse(await req.json());
    const leave = await prisma.leaveRequest.create({
      data: {
        teacherId: session.teacherId,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        reason: body.reason,
      },
    });
    return jsonOk(leave, 201);
  } catch (e) {
    return handleZodError(e);
  }
}
