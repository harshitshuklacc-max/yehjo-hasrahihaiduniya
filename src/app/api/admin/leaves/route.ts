import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { jsonError, jsonOk, handleZodError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { leaveReviewSchema } from "@/lib/validators";
import { z } from "zod";

const reviewBody = leaveReviewSchema.extend({ id: z.string() });

export async function GET() {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  const leaves = await prisma.leaveRequest.findMany({
    include: { teacher: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
  return jsonOk(leaves);
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const body = reviewBody.parse(await req.json());
    const leave = await prisma.leaveRequest.update({
      where: { id: body.id },
      data: {
        status: body.status,
        adminRemark: body.adminRemark,
        reviewedAt: new Date(),
      },
    });
    return jsonOk(leave);
  } catch (e) {
    return handleZodError(e);
  }
}
