import { NextRequest } from "next/server";
import { getAdminSession, hashPassword } from "@/lib/auth";
import { jsonError, jsonOk, handleZodError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { studentSchema } from "@/lib/validators";
import { generatePassword, uniqueUsername } from "@/lib/credentials";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  const q = req.nextUrl.searchParams.get("q") || "";
  const archived = req.nextUrl.searchParams.get("archived") === "true";

  const students = await prisma.student.findMany({
    where: {
      isArchived: archived,
      ...(q
        ? {
            OR: [
              { user: { name: { contains: q } } },
              { user: { username: { contains: q } } },
              { classLevel: { contains: q } },
            ],
          }
        : {}),
    },
    include: {
      user: { select: { id: true, name: true, username: true, phone: true, isActive: true } },
      batch: true,
      feeRecord: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return jsonOk(students);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const body = studentSchema.parse(await req.json());
    const password = body.password || generatePassword();
    const username = body.username || (await uniqueUsername("s", body.name));
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        username,
        phone: body.phone || null,
        role: "STUDENT",
        passwordHash: await hashPassword(password),
        student: {
          create: {
            classLevel: body.classLevel,
            parentName: body.parentName,
            parentPhone: body.parentPhone,
            address: body.address,
            batchId: body.batchId || null,
            recordExpiresAt: expiresAt,
            feeRecord: body.totalFees
              ? {
                  create: {
                    totalFees: body.totalFees,
                    paidFees: 0,
                    dueDate: body.dueDate ? new Date(body.dueDate) : null,
                  },
                }
              : undefined,
          },
        },
      },
      include: { student: { include: { feeRecord: true } } },
    });

    return jsonOk({ user, generatedPassword: body.password ? undefined : password }, 201);
  } catch (e) {
    return handleZodError(e);
  }
}
