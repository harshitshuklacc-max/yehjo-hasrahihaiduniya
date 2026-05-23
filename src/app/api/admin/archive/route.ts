import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { archiveExpiredStudents, restoreArchivedRecord } from "@/lib/archive";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  await archiveExpiredStudents();
  const archives = await prisma.studentArchive.findMany({
    where: { restoredAt: null },
    orderBy: { archivedAt: "desc" },
  });
  return jsonOk(archives);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  const { action, id } = await req.json();
  if (action === "restore" && id) {
    const studentId = await restoreArchivedRecord(id);
    if (!studentId) return jsonError("Archive not found", 404);
    return jsonOk({ studentId });
  }
  return jsonError("Invalid action");
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return jsonError("id required");
  await prisma.studentArchive.delete({ where: { id } });
  return jsonOk({ ok: true });
}
