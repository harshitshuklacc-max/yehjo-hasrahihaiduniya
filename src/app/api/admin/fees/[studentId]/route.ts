import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { jsonError, jsonOk, handleZodError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { feeUpdateSchema } from "@/lib/validators";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ studentId: string }> }) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);
  const { studentId } = await params;

  const fee = await prisma.feeRecord.findUnique({
    where: { studentId },
    include: { payments: { orderBy: { paidAt: "desc" } }, student: { include: { user: true } } },
  });
  return jsonOk(fee);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ studentId: string }> }) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);
  const { studentId } = await params;

  try {
    const body = feeUpdateSchema.parse(await req.json());
    let fee = await prisma.feeRecord.findUnique({ where: { studentId } });

    if (!fee) {
      fee = await prisma.feeRecord.create({
        data: {
          studentId,
          totalFees: body.totalFees ?? 0,
          paidFees: body.paidFees ?? 0,
          dueDate: body.dueDate ? new Date(body.dueDate) : null,
        },
      });
    } else {
      let paidFees = body.paidFees ?? fee.paidFees;
      if (body.payment) {
        paidFees += body.payment.amount;
        await prisma.feePayment.create({
          data: {
            feeRecordId: fee.id,
            amount: body.payment.amount,
            method: body.payment.method,
            note: body.payment.note,
          },
        });
      }
      fee = await prisma.feeRecord.update({
        where: { id: fee.id },
        data: {
          totalFees: body.totalFees ?? fee.totalFees,
          paidFees,
          dueDate: body.dueDate ? new Date(body.dueDate) : fee.dueDate,
        },
      });
    }

    const updated = await prisma.feeRecord.findUnique({
      where: { id: fee.id },
      include: { payments: { orderBy: { paidAt: "desc" } } },
    });
    return jsonOk(updated);
  } catch (e) {
    return handleZodError(e);
  }
}
