import { getAdminSession } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { archiveExpiredStudents } from "@/lib/archive";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  await archiveExpiredStudents();

  const [students, teachers, pendingLeaves, fees, classCounts] = await Promise.all([
    prisma.student.count({ where: { isArchived: false } }),
    prisma.teacher.count(),
    prisma.leaveRequest.count({ where: { status: "PENDING" } }),
    prisma.feeRecord.findMany({ include: { student: { include: { user: true } } } }),
    prisma.student.groupBy({
      by: ["classLevel"],
      where: { isArchived: false },
      _count: { classLevel: true },
    }),
  ]);

  const totalDue = fees.reduce((s, f) => s + (f.totalFees - f.paidFees), 0);
  const totalCollected = fees.reduce((s, f) => s + f.paidFees, 0);

  return jsonOk({
    stats: {
      students,
      teachers,
      classes: classCounts.length,
      pendingLeaves,
      totalDue,
      totalCollected,
    },
    chart: classCounts.map((c) => ({
      label: c.classLevel,
      value: c._count.classLevel,
    })),
  });
}
