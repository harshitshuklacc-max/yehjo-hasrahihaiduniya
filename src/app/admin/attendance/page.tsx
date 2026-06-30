"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { formatReportPeriod, MONTH_NAMES } from "@/lib/attendance-utils";
import { formatDate } from "@/lib/utils";
import { FileText, Trash2, Upload } from "lucide-react";

type Report = {
  id: string;
  title: string;
  month: number;
  year: number;
  fileName: string;
  createdAt: string;
  uploadedBy: string;
  studentCount: number;
  teacherCount: number;
  recipients: { name: string; role: string; matchedName: string }[];
};

export default function AdminAttendancePage() {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    month: String(new Date().getMonth() + 1),
    year: String(new Date().getFullYear()),
    file: null as File | null,
  });

  function load() {
    fetch("/api/admin/attendance").then((r) => r.json()).then(setReports);
  }

  useEffect(() => {
    load();
  }, []);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!form.file) {
      toast("Please select a PDF file", "error");
      return;
    }

    setUploading(true);
    const body = new FormData();
    body.append("title", form.title);
    body.append("month", form.month);
    body.append("year", form.year);
    body.append("file", form.file);

    const res = await fetch("/api/admin/attendance", { method: "POST", body });
    const data = await res.json();
    setUploading(false);

    if (res.ok) {
      toast(
        `Uploaded. Matched ${data.studentCount} students and ${data.teacherCount} teachers.`,
        "success"
      );
      setForm({
        title: "",
        month: String(new Date().getMonth() + 1),
        year: String(new Date().getFullYear()),
        file: null,
      });
      load();
    } else {
      toast(data.error || "Upload failed", "error");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this attendance report?")) return;
    const res = await fetch(`/api/admin/attendance/${id}`, { method: "DELETE" });
    toast(res.ok ? "Deleted" : "Failed", res.ok ? "success" : "error");
    if (res.ok) load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Monthly Attendance</h2>
        <p className="text-sm text-ssa-muted mt-1">
          Upload a monthly attendance PDF. The system reads student and teacher names from the PDF and
          shares it automatically with matching accounts.
        </p>
      </div>

      <form onSubmit={upload} className="glass rounded-2xl p-6 space-y-4 max-w-xl">
        <input
          placeholder="Report title (e.g. March 2026 Attendance)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <select value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} required>
            {MONTH_NAMES.map((name, index) => (
              <option key={name} value={String(index + 1)}>{name}</option>
            ))}
          </select>
          <input
            type="number"
            min={2000}
            max={2100}
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            required
          />
        </div>
        <label className="block">
          <span className="text-sm text-ssa-muted mb-2 block">Attendance PDF (max 8 MB)</span>
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
            required
          />
        </label>
        <button type="submit" className="btn-primary inline-flex gap-2" disabled={uploading}>
          <Upload className="h-4 w-4" />
          {uploading ? "Processing PDF..." : "Upload Attendance PDF"}
        </button>
      </form>

      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="glass rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-lg">{report.title}</p>
                <p className="text-sm text-ssa-muted">
                  {formatReportPeriod(report.month, report.year)} · Uploaded {formatDate(report.createdAt)} by {report.uploadedBy}
                </p>
                <p className="text-xs text-ssa-muted mt-1">{report.fileName}</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`/api/admin/attendance/${report.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-sm py-2 inline-flex gap-2"
                >
                  <FileText className="h-4 w-4" /> View PDF
                </a>
                <button type="button" className="btn-ghost text-sm py-2 text-ssa-accent" onClick={() => remove(report.id)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-ssa-primary/10 px-3 py-1">{report.studentCount} students matched</span>
              <span className="rounded-full bg-ssa-secondary/10 px-3 py-1">{report.teacherCount} teachers matched</span>
            </div>

            {report.recipients.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Matched names</p>
                <div className="flex flex-wrap gap-2">
                  {report.recipients.map((person, index) => (
                    <span key={`${person.name}-${index}`} className="rounded-lg border border-white/10 px-2 py-1 text-xs">
                      {person.name} ({person.role === "STUDENT" ? "Student" : "Teacher"})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {reports.length === 0 && <p className="text-ssa-muted">No attendance reports uploaded yet.</p>}
      </div>
    </div>
  );
}
