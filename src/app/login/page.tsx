import Image from "next/image";
import Link from "next/link";
import { ACADEMY } from "@/lib/academy";
import { Shield, GraduationCap, BookOpen } from "lucide-react";

const portals = [
  { href: "/login/admin", label: "Admin Portal", icon: Shield, desc: "Manage institute operations" },
  { href: "/login/teacher", label: "Teacher Portal", icon: GraduationCap, desc: "Homework, tests & materials" },
  { href: "/login/student", label: "Student Portal", icon: BookOpen, desc: "Fees, homework & timetable" },
];

export default function LoginHubPage() {
  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-4 py-16">
      <Image src={ACADEMY.logo} alt={ACADEMY.name} width={100} height={100} className="rounded-2xl mb-6" />
      <h1 className="text-3xl font-bold gradient-text">{ACADEMY.name}</h1>
      <p className="text-ssa-muted mt-2 mb-10">Select your portal to continue</p>
      <div className="grid gap-4 w-full max-w-lg">
        {portals.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="glass-strong flex items-center gap-4 rounded-2xl p-5 card-hover transition"
          >
            <p.icon className="h-10 w-10 text-ssa-primary shrink-0" />
            <div>
              <p className="font-semibold">{p.label}</p>
              <p className="text-sm text-ssa-muted">{p.desc}</p>
            </div>
          </Link>
        ))}
      </div>
      <Link href="/" className="mt-8 text-sm text-ssa-muted hover:text-ssa-primary">
        ← Back to website
      </Link>
    </div>
  );
}
