"use client";

import Link from "next/link";

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome, Teacher</h2>
      <div className="glass rounded-2xl p-6 grid gap-2 sm:grid-cols-2">
        <Link href="/teacher/homework" className="rounded-xl border border-white/10 p-4 hover:border-ssa-primary/50">Post Homework by Class</Link>
        <Link href="/teacher/materials" className="rounded-xl border border-white/10 p-4 hover:border-ssa-primary/50">Upload Study Materials</Link>
        <Link href="/teacher/tests" className="rounded-xl border border-white/10 p-4 hover:border-ssa-primary/50">Schedule Tests</Link>
        <Link href="/teacher/leave" className="rounded-xl border border-white/10 p-4 hover:border-ssa-primary/50">Apply for Leave</Link>
      </div>
    </div>
  );
}
