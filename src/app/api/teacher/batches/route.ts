import { getTeacherSession } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getTeacherSession();
  if (!session?.teacherId) return jsonError("Unauthorized", 401);

  const batches = await prisma.batch.findMany({
    where: { teachers: { some: { teacherId: session.teacherId } } },
    include: {
      students: { include: { user: { select: { id: true, name: true, username: true } } } },
      _count: { select: { students: true } },
    },
  });
  return jsonOk(batches);
}
