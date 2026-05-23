import { getStudentSession } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getStudentSession();
  if (!session?.studentId) return jsonError("Unauthorized", 401);

  const student = await prisma.student.findUnique({
    where: { id: session.studentId },
    include: {
      user: { select: { name: true, username: true, phone: true, email: true } },
      batch: {
        include: {
          timetable: { orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] },
          homeworks: { orderBy: { dueDate: "asc" }, take: 20 },
          materials: { orderBy: { createdAt: "desc" }, take: 20 },
          tests: { orderBy: { testDate: "asc" }, take: 20 },
        },
      },
      feeRecord: { include: { payments: { orderBy: { paidAt: "desc" } } } },
    },
  });

  if (!student) return jsonError("Student not found", 404);

  const announcements = await prisma.announcement.findMany({
    where: {
      OR: [
        { batchId: student.batchId },
        { batchId: null },
        { targetRole: "STUDENT" },
        { targetRole: null },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return jsonOk({ student, announcements });
}
