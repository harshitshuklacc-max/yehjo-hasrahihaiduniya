"use client";

import { useEffect, useState } from "react";
import { formatDate, formatPrice, DAYS } from "@/lib/utils";
import { Download } from "lucide-react";

type DashboardData = {
  student: {
    user: { name: string; username: string; phone?: string };
    classLevel: string;
    batch?: {
      name: string;
      timing?: string;
      timetable: { dayOfWeek: number; startTime: string; endTime: string; subject: string }[];
      homeworks: { id: string; title: string; description: string; dueDate: string }[];
      materials: { id: string; title: string; fileUrl: string; description?: string }[];
      tests: { id: string; subject: string; testDate: string; startTime?: string; instructions?: string }[];
    };
    feeRecord?: {
      totalFees: number;
      paidFees: number;
      dueDate?: string;
      payments: { amount: number; paidAt: string; method?: string }[];
    };
  };
  announcements: { id: string; title: string; body: string; createdAt: string }[];
};

export function useStudentData() {
  const [data, setData] = useState<DashboardData | null>(null);
  useEffect(() => {
    fetch("/api/student/dashboard").then((r) => r.json()).then(setData);
  }, []);
  return data;
}

export function StudentOverview() {
  const data = useStudentData();
  if (!data) return <div className="loading-shimmer h-48 rounded-2xl" />;
  const s = data.student;
  const fee = s.feeRecord;
  const remaining = (fee?.totalFees ?? 0) - (fee?.paidFees ?? 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Hello, {s.user.name}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card"><p className="text-sm text-ssa-muted">Class</p><p className="text-xl font-bold">{s.classLevel}</p></div>
        <div className="stat-card"><p className="text-sm text-ssa-muted">Batch</p><p className="text-xl font-bold">{s.batch?.name || "—"}</p></div>
        <div className="stat-card"><p className="text-sm text-ssa-muted">Fees Paid</p><p className="text-xl font-bold">{formatPrice(fee?.paidFees ?? 0)}</p></div>
        <div className="stat-card"><p className="text-sm text-ssa-muted">Remaining</p><p className="text-xl font-bold text-ssa-accent">{formatPrice(remaining)}</p></div>
      </div>
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold mb-3">Recent Notices</h3>
        {data.announcements.slice(0, 3).map((a) => (
          <div key={a.id} className="border-b border-white/5 py-3 last:border-0">
            <p className="font-medium text-sm">{a.title}</p>
            <p className="text-xs text-ssa-muted mt-1">{a.body.slice(0, 120)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StudentFeesView() {
  const data = useStudentData();
  if (!data?.student.feeRecord) return <p className="text-ssa-muted">No fee record assigned yet.</p>;
  const f = data.student.feeRecord;
  const remaining = f.totalFees - f.paidFees;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Fee Records</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="stat-card"><p className="text-sm text-ssa-muted">Total</p><p className="text-2xl font-bold">{formatPrice(f.totalFees)}</p></div>
        <div className="stat-card"><p className="text-sm text-ssa-muted">Paid</p><p className="text-2xl font-bold text-ssa-success">{formatPrice(f.paidFees)}</p></div>
        <div className="stat-card"><p className="text-sm text-ssa-muted">Remaining</p><p className="text-2xl font-bold text-ssa-accent">{formatPrice(remaining)}</p></div>
      </div>
      {f.dueDate && <p className="text-sm">Due date: {formatDate(f.dueDate)}</p>}
      <h3 className="font-semibold">Payment History</h3>
      <div className="space-y-2">
        {f.payments.map((p, i) => (
          <div key={i} className="glass rounded-xl p-4 flex justify-between text-sm">
            <span>{formatDate(p.paidAt)} · {p.method || "Payment"}</span>
            <span className="font-semibold text-ssa-success">{formatPrice(p.amount)}</span>
          </div>
        ))}
        {f.payments.length === 0 && <p className="text-ssa-muted text-sm">No payments recorded yet.</p>}
      </div>
    </div>
  );
}

export function StudentHomeworkView() {
  const data = useStudentData();
  const hw = data?.student.batch?.homeworks ?? [];
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Homework</h2>
      {hw.map((h) => (
        <div key={h.id} className="glass rounded-2xl p-5">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">{h.title}</h3>
            <span className="text-xs text-ssa-accent">Due {formatDate(h.dueDate)}</span>
          </div>
          <p className="text-sm text-ssa-muted mt-2">{h.description}</p>
        </div>
      ))}
      {hw.length === 0 && <p className="text-ssa-muted">No homework assigned.</p>}
    </div>
  );
}

export function StudentTimetableView() {
  const data = useStudentData();
  const slots = data?.student.batch?.timetable ?? [];
  const byDay = DAYS.map((day, idx) => ({
    day,
    slots: slots.filter((s) => s.dayOfWeek === idx),
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Timetable</h2>
      {byDay.map(({ day, slots: daySlots }) =>
        daySlots.length > 0 ? (
          <div key={day} className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-ssa-primary">{day}</h3>
            <ul className="mt-3 space-y-2">
              {daySlots.map((s, i) => (
                <li key={i} className="text-sm flex justify-between">
                  <span>{s.subject}</span>
                  <span className="text-ssa-muted">{s.startTime} – {s.endTime}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null
      )}
    </div>
  );
}

export function StudentTestsView() {
  const data = useStudentData();
  const tests = data?.student.batch?.tests ?? [];
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Test Calendar</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {tests.map((t) => (
          <div key={t.id} className="glass rounded-2xl p-5 border-l-4 border-l-ssa-secondary">
            <p className="font-bold">{t.subject}</p>
            <p className="text-sm text-ssa-primary mt-1">{formatDate(t.testDate)} {t.startTime && `· ${t.startTime}`}</p>
            {t.instructions && <p className="text-xs text-ssa-muted mt-2">{t.instructions}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StudentNoticesView() {
  const data = useStudentData();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Notices</h2>
      {data?.announcements.map((a) => (
        <div key={a.id} className="glass rounded-xl p-5">
          <p className="font-semibold">{a.title}</p>
          <p className="text-sm text-ssa-muted mt-2">{a.body}</p>
          <p className="text-xs text-ssa-muted mt-2">{formatDate(a.createdAt)}</p>
        </div>
      ))}
    </div>
  );
}

export function StudentMaterialsView() {
  const data = useStudentData();
  const mats = data?.student.batch?.materials ?? [];
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Study Resources</h2>
      {mats.map((m) => (
        <a
          key={m.id}
          href={m.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="glass rounded-xl p-5 flex items-center justify-between card-hover block"
        >
          <div>
            <p className="font-semibold">{m.title}</p>
            {m.description && <p className="text-xs text-ssa-muted">{m.description}</p>}
          </div>
          <Download className="h-5 w-5 text-ssa-primary" />
        </a>
      ))}
    </div>
  );
}

export function StudentProfileView() {
  const data = useStudentData();
  if (!data) return null;
  const u = data.student.user;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Profile</h2>
      <div className="glass rounded-2xl p-6 max-w-md space-y-3 text-sm">
        <p><span className="text-ssa-muted">Name:</span> {u.name}</p>
        <p><span className="text-ssa-muted">Username:</span> {u.username}</p>
        <p><span className="text-ssa-muted">Class:</span> {data.student.classLevel}</p>
        <p><span className="text-ssa-muted">Batch:</span> {data.student.batch?.name || "—"}</p>
        {u.phone && <p><span className="text-ssa-muted">Phone:</span> {u.phone}</p>}
      </div>
    </div>
  );
}
