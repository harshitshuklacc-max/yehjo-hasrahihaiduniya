import { NextRequest } from "next/server";
import { getStudentSession } from "@/lib/auth";
import { jsonError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getStudentSession();
  if (!session) return jsonError("Unauthorized", 401);

  const { id } = await params;
  const access = await prisma.attendanceReportRecipient.findFirst({
    where: { reportId: id, userId: session.userId },
    include: { report: true },
  });

  if (!access) return jsonError("Not found", 404);

  const buffer = Buffer.from(access.report.fileData, "base64");
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${access.report.fileName}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
