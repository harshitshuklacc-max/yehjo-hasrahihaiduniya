"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { formatDate } from "@/lib/utils";

export default function AdminArchivePage() {
  const { toast } = useToast();
  const [archives, setArchives] = useState<{ id: string; originalStudentId: string; archivedAt: string }[]>([]);

  function load() {
    fetch("/api/admin/archive").then((r) => r.json()).then(setArchives);
  }

  useEffect(() => { load(); }, []);

  async function restore(id: string) {
    const res = await fetch("/api/admin/archive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "restore", id }),
    });
    toast(res.ok ? "Record restored" : "Failed", res.ok ? "success" : "error");
    load();
  }

  async function remove(id: string) {
    if (!confirm("Permanently delete archived record?")) return;
    const res = await fetch(`/api/admin/archive?id=${id}`, { method: "DELETE" });
    toast(res.ok ? "Deleted" : "Failed", res.ok ? "success" : "error");
    load();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Archived Student Records</h2>
      <p className="text-sm text-ssa-muted">Records auto-archive after 1 year. Restore or delete manually.</p>
      <div className="space-y-3">
        {archives.map((a) => (
          <div key={a.id} className="glass rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">Student ID: {a.originalStudentId}</p>
              <p className="text-xs text-ssa-muted">Archived {formatDate(a.archivedAt)}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn-primary text-sm py-2" onClick={() => restore(a.id)}>Restore</button>
              <button type="button" className="btn-ghost text-sm py-2" onClick={() => remove(a.id)}>Delete</button>
            </div>
          </div>
        ))}
        {archives.length === 0 && <p className="text-ssa-muted">No archived records.</p>}
      </div>
    </div>
  );
}
