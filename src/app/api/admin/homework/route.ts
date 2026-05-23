import { getAdminSession } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  const homework = await prisma.homework.findMany({
    include: {
      batch: true,
      teacher: { include: { user: { select: { name: true } } } },
    },
    orderBy: { dueDate: "asc" },
  });
  return jsonOk(homework);
}
