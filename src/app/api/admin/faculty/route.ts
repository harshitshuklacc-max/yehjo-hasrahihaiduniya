import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { jsonError, jsonOk, handleZodError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { facultyShowcaseSchema } from "@/lib/validators";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);
  const items = await prisma.facultyShowcase.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });
  return jsonOk(items);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const body = facultyShowcaseSchema.parse(await req.json());
    const item = await prisma.facultyShowcase.create({
      data: {
        name: body.name,
        subject: body.subject,
        experience: body.experience,
        bio: body.bio || null,
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
      },
    });
    return jsonOk(item, 201);
  } catch (e) {
    return handleZodError(e);
  }
}
