import { prisma } from "@/lib/prisma";
import { HomeSections } from "@/components/academy/HomeSections";

export const dynamic = "force-dynamic";

type Faculty = { id: string; name: string; subject: string; experience: string; bio: string | null };
type Testimonial = { id: string; author: string; role: string; rating: number; content: string };

const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    author: "Rahul S.",
    role: "Class 10 Student",
    rating: 5,
    content:
      "Smart Step Academy transformed my academics. The teachers are supportive and the batch environment is excellent.",
  },
  {
    id: "2",
    author: "Mrs. Kavita M.",
    role: "Parent",
    rating: 5,
    content:
      "We trust Smart Step for our child's future. Regular updates, quality teaching, and friendly management.",
  },
  {
    id: "3",
    author: "Ananya T.",
    role: "Class 12 Commerce",
    rating: 5,
    content:
      "Best coaching in Bilaspur! Personalized mentorship and result-oriented approach helped me score well.",
  },
];

export default async function HomePage() {
  let faculty: Faculty[] = [];
  let testimonials: Testimonial[] = fallbackTestimonials;
  let dbReady = true;

  try {
    const [dbFaculty, dbTestimonials] = await Promise.all([
      prisma.facultyShowcase.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      prisma.testimonial.findMany({ where: { isActive: true }, take: 6, orderBy: { createdAt: "desc" } }),
    ]);
    faculty = dbFaculty;
    testimonials = dbTestimonials.length > 0 ? dbTestimonials : fallbackTestimonials;
  } catch {
    dbReady = false;
  }

  return (
    <>
      {!dbReady && (
        <div className="bg-ssa-accent/10 border-b border-ssa-accent/30 px-4 py-2 text-center text-sm text-ssa-accent">
          Database not connected. Run <code className="font-mono">setup-db.bat</code> or{" "}
          <code className="font-mono">npx prisma db push</code> then <code className="font-mono">npm run db:seed</code>
        </div>
      )}
      <HomeSections faculty={faculty} testimonials={testimonials} />
    </>
  );
}
