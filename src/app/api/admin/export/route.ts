import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { csvResponse, jsonError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  const type = req.nextUrl.searchParams.get("type") || "students";

  if (type === "students") {
    const students = await prisma.student.findMany({
      include: { user: true, batch: true, feeRecord: true },
    });
    const rows = [
      ["Name", "Username", "Class", "Batch", "Total Fees", "Paid", "Remaining"],
      ...students.map((s) => [
        s.user.name,
        s.user.username,
        s.classLevel,
        s.batch?.name || "",
        String(s.feeRecord?.totalFees ?? 0),
        String(s.feeRecord?.paidFees ?? 0),
        String((s.feeRecord?.totalFees ?? 0) - (s.feeRecord?.paidFees ?? 0)),
      ]),
    ];
    return csvResponse("students.csv", rows);
  }

  const teachers = await prisma.teacher.findMany({ include: { user: true } });
  const rows = [
    ["Name", "Username", "Subject", "Phone"],
    ...teachers.map((t) => [t.user.name, t.user.username, t.subject || "", t.user.phone || ""]),
  ];
  return csvResponse("teachers.csv", rows);
}
