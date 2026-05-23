"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TeacherDashboardPage() {
  const [batches, setBatches] = useState<{ id: string; name: string; _count: { students: number } }[]>([]);

  useEffect(() => {
    fetch("/api/teacher/batches").then((r) => r.json()).then(setBatches);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome, Teacher</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {batches.map((b) => (
          <div key={b.id} className="stat-card card-hover">
            <h3 className="font-bold">{b.name}</h3>
            <p className="text-sm text-ssa-muted mt-1">{b._count.students} students</p>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl p-6 grid gap-2 sm:grid-cols-2">
        <Link href="/teacher/homework" className="rounded-xl border border-white/10 p-4 hover:border-ssa-primary/50">Upload Homework</Link>
        <Link href="/teacher/tests" className="rounded-xl border border-white/10 p-4 hover:border-ssa-primary/50">Schedule Tests</Link>
        <Link href="/teacher/leave" className="rounded-xl border border-white/10 p-4 hover:border-ssa-primary/50">Apply for Leave</Link>
      </div>
    </div>
  );
}
