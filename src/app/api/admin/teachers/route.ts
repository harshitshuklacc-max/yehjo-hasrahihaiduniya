import { NextRequest } from "next/server";
import { getAdminSession, hashPassword } from "@/lib/auth";
import { jsonError, jsonOk, handleZodError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { teacherSchema } from "@/lib/validators";
import { generatePassword, uniqueUsername } from "@/lib/credentials";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  const q = req.nextUrl.searchParams.get("q") || "";
  const teachers = await prisma.teacher.findMany({
    where: q
      ? {
          OR: [
            { user: { name: { contains: q } } },
            { user: { username: { contains: q } } },
            { subject: { contains: q } },
          ],
        }
      : undefined,
    include: {
      user: { select: { id: true, name: true, username: true, phone: true, email: true, isActive: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return jsonOk(teachers);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const body = teacherSchema.parse(await req.json());
    const password = body.password || generatePassword();
    const username = body.username || (await uniqueUsername("t", body.name));

    const user = await prisma.user.create({
      data: {
        name: body.name,
        username,
        email: body.email || null,
        phone: body.phone || null,
        role: "TEACHER",
        passwordHash: await hashPassword(password),
        teacher: {
          create: {
            subject: body.subject,
            qualification: body.qualification,
            experience: body.experience,
            bio: body.bio,
          },
        },
      },
      include: { teacher: true },
    });

    return jsonOk({ user, generatedPassword: body.password ? undefined : password }, 201);
  } catch (e) {
    return handleZodError(e);
  }
}
