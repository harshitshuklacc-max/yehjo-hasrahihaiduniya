import { getAdminSession } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { archiveExpiredStudents } from "@/lib/archive";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  await archiveExpiredStudents();

  const [students, teachers, batches, pendingLeaves, fees] = await Promise.all([
    prisma.student.count({ where: { isArchived: false } }),
    prisma.teacher.count(),
    prisma.batch.count({ where: { isActive: true } }),
    prisma.leaveRequest.count({ where: { status: "PENDING" } }),
    prisma.feeRecord.findMany({ include: { student: { include: { user: true } } } }),
  ]);

  const totalDue = fees.reduce((s, f) => s + (f.totalFees - f.paidFees), 0);
  const totalCollected = fees.reduce((s, f) => s + f.paidFees, 0);

  const batchCounts = await prisma.batch.findMany({
    include: { _count: { select: { students: true } } },
  });

  return jsonOk({
    stats: {
      students,
      teachers,
      batches,
      pendingLeaves,
      totalDue,
      totalCollected,
    },
    chart: batchCounts.map((b) => ({
      label: b.name,
      value: b._count.students,
    })),
  });
}
