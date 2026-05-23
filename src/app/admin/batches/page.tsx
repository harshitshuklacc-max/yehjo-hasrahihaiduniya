"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { Plus } from "lucide-react";

export default function AdminBatchesPage() {
  const { toast } = useToast();
  const [batches, setBatches] = useState<
    { id: string; name: string; classLevel: string; timing?: string; _count: { students: number } }[]
  >([]);
  const [teachers, setTeachers] = useState<{ id: string; user: { name: string } }[]>([]);
  const [form, setForm] = useState({ name: "", classLevel: "", stream: "", timing: "", teacherIds: "" });

  function load() {
    fetch("/api/admin/batches").then((r) => r.json()).then(setBatches);
  }

  useEffect(() => {
    load();
    fetch("/api/admin/teachers").then((r) => r.json()).then(setTeachers);
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/batches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        teacherIds: form.teacherIds ? form.teacherIds.split(",").map((s) => s.trim()) : [],
      }),
    });
    if (res.ok) {
      toast("Batch created", "success");
      setForm({ name: "", classLevel: "", stream: "", timing: "", teacherIds: "" });
      load();
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Batches</h2>
      <form onSubmit={create} className="glass rounded-2xl p-6 grid gap-4 sm:grid-cols-2">
        <input placeholder="Batch Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Class Level" value={form.classLevel} onChange={(e) => setForm({ ...form, classLevel: e.target.value })} required />
        <input placeholder="Stream (optional)" value={form.stream} onChange={(e) => setForm({ ...form, stream: e.target.value })} />
        <input placeholder="Timing" value={form.timing} onChange={(e) => setForm({ ...form, timing: e.target.value })} />
        <select value={form.teacherIds} onChange={(e) => setForm({ ...form, teacherIds: e.target.value })} className="sm:col-span-2">
          <option value="">Assign teacher (select ID from list below)</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.user.name} — ID: {t.id}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-primary"><Plus className="h-4 w-4" /> Create Batch</button>
      </form>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {batches.map((b) => (
          <div key={b.id} className="glass rounded-2xl p-5 card-hover">
            <h3 className="font-bold">{b.name}</h3>
            <p className="text-sm text-ssa-primary">{b.classLevel}</p>
            <p className="text-xs text-ssa-muted mt-1">{b.timing}</p>
            <p className="mt-3 text-sm">{b._count.students} students</p>
          </div>
        ))}
      </div>
    </div>
  );
}
