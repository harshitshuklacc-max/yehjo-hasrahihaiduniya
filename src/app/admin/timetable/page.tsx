"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { DAYS } from "@/lib/utils";

export default function AdminTimetablePage() {
  const { toast } = useToast();
  const [batches, setBatches] = useState<{ id: string; name: string }[]>([]);
  const [batchId, setBatchId] = useState("");
  const [slots, setSlots] = useState<
    { dayOfWeek: number; startTime: string; endTime: string; subject: string }[]
  >([{ dayOfWeek: 1, startTime: "09:00", endTime: "10:00", subject: "Math" }]);

  useEffect(() => {
    fetch("/api/admin/batches").then((r) => r.json()).then(setBatches);
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!batchId) return;
    const res = await fetch("/api/admin/timetable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batchId, slots }),
    });
    toast(res.ok ? "Timetable saved" : "Failed", res.ok ? "success" : "error");
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Timetable Manager</h2>
      <select value={batchId} onChange={(e) => setBatchId(e.target.value)}>
        <option value="">Select batch</option>
        {batches.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>
      <form onSubmit={save} className="space-y-4">
        {slots.map((s, i) => (
          <div key={i} className="glass rounded-xl p-4 grid gap-3 sm:grid-cols-4">
            <select value={s.dayOfWeek} onChange={(e) => {
              const n = [...slots];
              n[i].dayOfWeek = Number(e.target.value);
              setSlots(n);
            }}>
              {DAYS.map((d, idx) => (
                <option key={d} value={idx}>{d}</option>
              ))}
            </select>
            <input type="time" value={s.startTime} onChange={(e) => { const n = [...slots]; n[i].startTime = e.target.value; setSlots(n); }} />
            <input type="time" value={s.endTime} onChange={(e) => { const n = [...slots]; n[i].endTime = e.target.value; setSlots(n); }} />
            <input placeholder="Subject" value={s.subject} onChange={(e) => { const n = [...slots]; n[i].subject = e.target.value; setSlots(n); }} />
          </div>
        ))}
        <button type="button" className="btn-ghost" onClick={() => setSlots([...slots, { dayOfWeek: 1, startTime: "10:00", endTime: "11:00", subject: "" }])}>
          + Add slot
        </button>
        <button type="submit" className="btn-primary block">Save Timetable</button>
      </form>
    </div>
  );
}
