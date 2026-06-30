"use client";

import { useEffect, useState } from "react";
import { formatReportPeriod } from "@/lib/attendance-utils";
import { formatDate } from "@/lib/utils";
import { FileText } from "lucide-react";

type Report = {
  id: string;
  title: string;
  month: number;
  year: number;
  fileName: string;
  createdAt: string;
};

export function AttendanceReportsView({ apiBase }: { apiBase: "/api/student/attendance" | "/api/teacher/attendance" }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch(apiBase).then((r) => r.json()).then((items: Report[]) => {
      setReports(items);
      if (items[0]) setSelectedId(items[0].id);
    });
  }, [apiBase]);

  const selected = reports.find((report) => report.id === selectedId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Attendance</h2>
        <p className="text-sm text-ssa-muted mt-1">
          Monthly attendance PDFs shared with you by the admin.
        </p>
      </div>

      {reports.length === 0 ? (
        <p className="text-ssa-muted">No attendance reports available for your account yet.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="space-y-2">
            {reports.map((report) => (
              <button
                key={report.id}
                type="button"
                onClick={() => setSelectedId(report.id)}
                className={`w-full text-left glass rounded-xl p-4 transition ${
                  selectedId === report.id ? "border border-ssa-primary/50" : "card-hover"
                }`}
              >
                <p className="font-semibold text-sm">{report.title}</p>
                <p className="text-xs text-ssa-muted mt-1">{formatReportPeriod(report.month, report.year)}</p>
                <p className="text-xs text-ssa-muted mt-1">Uploaded {formatDate(report.createdAt)}</p>
              </button>
            ))}
          </div>

          {selected && (
            <div className="glass rounded-2xl overflow-hidden min-h-[70vh]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div>
                  <p className="font-semibold">{selected.title}</p>
                  <p className="text-xs text-ssa-muted">{selected.fileName}</p>
                </div>
                <a
                  href={`${apiBase}/${selected.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-sm py-2 inline-flex gap-2"
                >
                  <FileText className="h-4 w-4" /> Open PDF
                </a>
              </div>
              <iframe
                title={selected.title}
                src={`${apiBase}/${selected.id}`}
                className="w-full h-[calc(70vh-56px)]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
