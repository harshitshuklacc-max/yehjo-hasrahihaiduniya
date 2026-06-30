import { getTeacherSession } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getTeacherSession();
  if (!session) return jsonError("Unauthorized", 401);

  const reports = await prisma.attendanceReport.findMany({
    where: {
      recipients: { some: { userId: session.userId } },
    },
    orderBy: [{ year: "desc" }, { month: "desc" }],
    select: {
      id: true,
      title: true,
      month: true,
      year: true,
      fileName: true,
      createdAt: true,
    },
  });

  return jsonOk(reports);
}
