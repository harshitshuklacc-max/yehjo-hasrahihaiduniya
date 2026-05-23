"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { formatDate } from "@/lib/utils";

type Leave = {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  teacher: { user: { name: string } };
};

export default function AdminLeavesPage() {
  const { toast } = useToast();
  const [leaves, setLeaves] = useState<Leave[]>([]);

  function load() {
    fetch("/api/admin/leaves").then((r) => r.json()).then(setLeaves);
  }

  useEffect(() => { load(); }, []);

  async function review(id: string, status: "APPROVED" | "REJECTED") {
    const adminRemark = prompt("Add remark (optional)") || undefined;
    const res = await fetch("/api/admin/leaves", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, adminRemark }),
    });
    toast(res.ok ? `Leave ${status.toLowerCase()}` : "Failed", res.ok ? "success" : "error");
    load();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Teacher Leave Requests</h2>
      <div className="space-y-4">
        {leaves.map((l) => (
          <div key={l.id} className="glass rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{l.teacher.user.name}</p>
              <p className="text-sm text-ssa-muted">{formatDate(l.startDate)} — {formatDate(l.endDate)}</p>
              <p className="text-sm mt-2">{l.reason}</p>
              <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                l.status === "PENDING" ? "bg-ssa-accent/20 text-ssa-accent" :
                l.status === "APPROVED" ? "bg-ssa-success/20 text-ssa-success" : "bg-red-500/20 text-red-400"
              }`}>{l.status}</span>
            </div>
            {l.status === "PENDING" && (
              <div className="flex gap-2">
                <button type="button" className="btn-primary text-sm py-2" onClick={() => review(l.id, "APPROVED")}>Approve</button>
                <button type="button" className="btn-ghost text-sm py-2" onClick={() => review(l.id, "REJECTED")}>Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
