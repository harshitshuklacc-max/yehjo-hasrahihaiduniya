import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

export const teacherSchema = z.object({
  name: z.string().min(2),
  subject: z.string().optional(),
  qualification: z.string().optional(),
  experience: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  username: z.string().optional(),
  password: z.string().optional(),
});

export const studentSchema = z.object({
  name: z.string().min(2),
  classLevel: z.string().min(1),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  totalFees: z.number().optional(),
  dueDate: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
});

export const timetableSchema = z.object({
  classLevel: z.string().min(1),
  slots: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: z.string(),
      endTime: z.string(),
      subject: z.string(),
      teacherId: z.string().optional(),
      room: z.string().optional(),
    })
  ),
});

export const homeworkSchema = z.object({
  classLevel: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  dueDate: z.string(),
  attachments: z.array(z.string()).optional(),
});

export const feeUpdateSchema = z.object({
  totalFees: z.number().optional(),
  paidFees: z.number().optional(),
  dueDate: z.string().optional(),
  payment: z
    .object({
      amount: z.number().positive(),
      method: z.string().optional(),
      note: z.string().optional(),
    })
    .optional(),
});

export const leaveSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().min(3),
});

export const leaveReviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  adminRemark: z.string().optional(),
});

export const testSchema = z.object({
  classLevel: z.string().min(1),
  subject: z.string().min(1),
  syllabus: z.string().optional(),
  testDate: z.string(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  instructions: z.string().optional(),
});

export const announcementSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  classLevel: z.string().optional().nullable(),
  targetRole: z.string().optional(),
});

export const facultyShowcaseSchema = z.object({
  name: z.string().min(2),
  subject: z.string().min(1),
  experience: z.string().min(1),
  bio: z.string().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const materialSchema = z.object({
  classLevel: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  fileUrl: z.string().url().or(z.string().min(1)),
});
