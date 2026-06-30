import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  const { id } = await params;
  await prisma.attendanceReport.delete({ where: { id } });
  return jsonOk({ ok: true });
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  const { id } = await params;
  const report = await prisma.attendanceReport.findUnique({ where: { id } });
  if (!report) return jsonError("Not found", 404);

  const buffer = Buffer.from(report.fileData, "base64");
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${report.fileName}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
