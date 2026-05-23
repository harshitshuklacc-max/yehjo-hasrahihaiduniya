import { prisma } from "./prisma";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export async function archiveExpiredStudents() {
  const cutoff = new Date(Date.now() - ONE_YEAR_MS);
  const expired = await prisma.student.findMany({
    where: {
      isArchived: false,
      createdAt: { lt: cutoff },
    },
    include: {
      user: true,
      batch: true,
      feeRecord: { include: { payments: true } },
      attendances: true,
    },
  });

  for (const student of expired) {
    const homeworks = student.batchId
      ? await prisma.homework.findMany({ where: { batchId: student.batchId } })
      : [];
    const tests = student.batchId
      ? await prisma.testSchedule.findMany({ where: { batchId: student.batchId } })
      : [];
    const timetable = student.batchId
      ? await prisma.timetableSlot.findMany({ where: { batchId: student.batchId } })
      : [];
    const loginLogs = await prisma.loginActivity.findMany({
      where: { userId: student.userId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const snapshot = JSON.stringify({
      student,
      homeworks,
      tests,
      timetable,
      loginLogs,
      archivedReason: "auto_1_year",
    });

    await prisma.studentArchive.create({
      data: {
        originalStudentId: student.id,
        originalUserId: student.userId,
        snapshot,
      },
    });

    await prisma.student.update({
      where: { id: student.id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
        batchId: null,
      },
    });

    await prisma.user.update({
      where: { id: student.userId },
      data: { isActive: false },
    });
  }

  return expired.length;
}

export async function restoreArchivedRecord(archiveId: string) {
  const archive = await prisma.studentArchive.findUnique({ where: { id: archiveId } });
  if (!archive) return null;

  const data = JSON.parse(archive.snapshot) as {
    student: { id: string; userId: string };
  };

  await prisma.student.update({
    where: { id: data.student.id },
    data: {
      isArchived: false,
      archivedAt: null,
      recordExpiresAt: new Date(Date.now() + ONE_YEAR_MS),
    },
  });

  await prisma.user.update({
    where: { id: data.student.userId },
    data: { isActive: true },
  });

  await prisma.studentArchive.update({
    where: { id: archiveId },
    data: { restoredAt: new Date() },
  });

  return data.student.id;
}
