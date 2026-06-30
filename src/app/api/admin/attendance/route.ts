import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { extractPdfText } from "@/lib/attendance-pdf.server";
import { matchPeopleInPdfText } from "@/lib/attendance-utils";

const MAX_FILE_SIZE = 8 * 1024 * 1024;

export async function GET() {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  const reports = await prisma.attendanceReport.findMany({
    orderBy: [{ year: "desc" }, { month: "desc" }, { createdAt: "desc" }],
    include: {
      uploadedBy: { select: { name: true } },
      recipients: {
        include: { user: { select: { name: true, role: true } } },
      },
    },
  });

  return jsonOk(
    reports.map((report) => ({
      id: report.id,
      title: report.title,
      month: report.month,
      year: report.year,
      fileName: report.fileName,
      createdAt: report.createdAt,
      uploadedBy: report.uploadedBy.name,
      studentCount: report.recipients.filter((r) => r.role === "STUDENT").length,
      teacherCount: report.recipients.filter((r) => r.role === "TEACHER").length,
      recipients: report.recipients.map((r) => ({
        id: r.id,
        name: r.user.name,
        role: r.role,
        matchedName: r.matchedName,
      })),
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const title = String(formData.get("title") || "").trim();
    const month = Number(formData.get("month"));
    const year = Number(formData.get("year"));

    if (!(file instanceof File)) return jsonError("PDF file is required", 400);
    if (!title) return jsonError("Title is required", 400);
    if (!month || month < 1 || month > 12) return jsonError("Valid month is required", 400);
    if (!year || year < 2000 || year > 2100) return jsonError("Valid year is required", 400);
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return jsonError("Only PDF files are allowed", 400);
    }
    if (file.size > MAX_FILE_SIZE) return jsonError("PDF must be 8 MB or smaller", 400);

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfText = await extractPdfText(buffer);

    const [students, teachers] = await Promise.all([
      prisma.student.findMany({
        where: { isArchived: false, user: { isActive: true } },
        include: { user: { select: { id: true, name: true } } },
      }),
      prisma.teacher.findMany({
        include: { user: { select: { id: true, name: true, isActive: true } } },
      }),
    ]);

    const people = [
      ...students.map((s) => ({
        userId: s.user.id,
        name: s.user.name,
        role: "STUDENT" as const,
      })),
      ...teachers
        .filter((t) => t.user.isActive)
        .map((t) => ({
          userId: t.user.id,
          name: t.user.name,
          role: "TEACHER" as const,
        })),
    ];

    const matched = matchPeopleInPdfText(pdfText, people);
    const fileData = buffer.toString("base64");

    const report = await prisma.attendanceReport.create({
      data: {
        title,
        month,
        year,
        fileName: file.name,
        fileData,
        uploadedById: session.userId,
        recipients: {
          create: matched.map((person) => ({
            userId: person.userId,
            role: person.role,
            matchedName: person.matchedName,
          })),
        },
      },
      include: {
        recipients: {
          include: { user: { select: { name: true, role: true } } },
        },
      },
    });

    return jsonOk(
      {
        id: report.id,
        title: report.title,
        month: report.month,
        year: report.year,
        fileName: report.fileName,
        studentCount: report.recipients.filter((r) => r.role === "STUDENT").length,
        teacherCount: report.recipients.filter((r) => r.role === "TEACHER").length,
        recipients: report.recipients.map((r) => ({
          name: r.user.name,
          role: r.role,
          matchedName: r.matchedName,
        })),
      },
      201
    );
  } catch (error) {
    console.error("Attendance upload failed:", error);
    return jsonError("Failed to process attendance PDF", 500);
  }
}
