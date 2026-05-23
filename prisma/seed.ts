import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("SmartTed*#1", 12);

  await prisma.user.upsert({
    where: { username: "Smartstep05618" },
    update: { passwordHash: adminPassword, role: UserRole.ADMIN, isActive: true },
    create: {
      username: "Smartstep05618",
      name: "Smart Step Academy Admin",
      role: UserRole.ADMIN,
      passwordHash: adminPassword,
    },
  });

  const faculty = [
    { name: "Mr. Rajesh Verma", subject: "Mathematics", experience: "12+ years", order: 0 },
    { name: "Mrs. Priya Sharma", subject: "Science", experience: "10+ years", order: 1 },
    { name: "Mr. Amit Patel", subject: "Commerce", experience: "8+ years", order: 2 },
    { name: "Mrs. Sneha Dubey", subject: "English", experience: "9+ years", order: 3 },
  ];

  for (const f of faculty) {
    const exists = await prisma.facultyShowcase.findFirst({ where: { name: f.name } });
    if (!exists) await prisma.facultyShowcase.create({ data: f });
  }

  const testimonials = [
    {
      author: "Rahul S.",
      role: "Class 10 Student",
      rating: 5,
      content:
        "Smart Step Academy transformed my academics. The teachers are supportive and the batch environment is excellent.",
    },
    {
      author: "Mrs. Kavita M.",
      role: "Parent",
      rating: 5,
      content:
        "We trust Smart Step for our child's future. Regular updates, quality teaching, and friendly management.",
    },
    {
      author: "Ananya T.",
      role: "Class 12 Commerce",
      rating: 5,
      content:
        "Best coaching in Bilaspur! Personalized mentorship and result-oriented approach helped me score well.",
    },
  ];

  for (const t of testimonials) {
    const exists = await prisma.testimonial.findFirst({ where: { author: t.author } });
    if (!exists) await prisma.testimonial.create({ data: t });
  }

  console.log("✓ Admin seeded (username: Smartstep05618)");
  console.log("✓ Faculty & testimonials seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
