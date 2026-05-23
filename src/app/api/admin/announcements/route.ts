import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { jsonError, jsonOk, handleZodError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { announcementSchema } from "@/lib/validators";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);
  const items = await prisma.announcement.findMany({
    include: { createdBy: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return jsonOk(items);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const body = announcementSchema.parse(await req.json());
    const item = await prisma.announcement.create({
      data: {
        title: body.title,
        body: body.body,
        batchId: body.batchId || null,
        targetRole: body.targetRole || null,
        createdById: session.userId,
      },
    });
    return jsonOk(item, 201);
  } catch (e) {
    return handleZodError(e);
  }
}
