"use client";

import { useEffect, useState } from "react";
import { StatCards, SimpleBarChart } from "@/components/dashboard/StatCards";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Download } from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<{
    stats: Record<string, number>;
    chart: { label: string; value: number }[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return <div className="loading-shimmer h-64 rounded-2xl" />;
  }

  const s = data.stats;
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Overview</h2>
        <div className="flex gap-2">
          <a href="/api/admin/export?type=students" className="btn-ghost text-sm py-2">
            <Download className="h-4 w-4" /> Export Students
          </a>
          <a href="/api/admin/export?type=teachers" className="btn-ghost text-sm py-2">
            <Download className="h-4 w-4" /> Export Teachers
          </a>
        </div>
      </div>
      <StatCards
        stats={[
          { label: "Active Students", value: s.students },
          { label: "Teachers", value: s.teachers },
          { label: "Classes", value: s.classes },
          { label: "Pending Leaves", value: s.pendingLeaves },
          { label: "Fees Collected", value: formatPrice(s.totalCollected) },
          { label: "Outstanding Fees", value: formatPrice(s.totalDue) },
        ]}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <SimpleBarChart data={data.chart} />
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ["/admin/students", "Add Student"],
              ["/admin/teachers", "Add Teacher"],
              ["/admin/timetable", "Manage Timetable"],
              ["/admin/attendance", "Upload Attendance"],
              ["/admin/leaves", "Review Leaves"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-xl border border-white/10 px-4 py-3 text-sm hover:border-ssa-primary/50 transition">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
