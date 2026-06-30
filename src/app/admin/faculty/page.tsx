"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { Trash2 } from "lucide-react";

type FacultyItem = {
  id: string;
  name: string;
  subject: string;
  experience: string;
  bio: string | null;
  order: number;
  isActive: boolean;
};

export default function AdminFacultyPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<FacultyItem[]>([]);
  const [form, setForm] = useState({ name: "", subject: "", experience: "", bio: "" });

  function load() {
    fetch("/api/admin/faculty").then((r) => r.json()).then(setItems);
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/faculty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, order: items.length }),
    });
    toast(res.ok ? "Faculty added to homepage" : "Failed", res.ok ? "success" : "error");
    if (res.ok) {
      setForm({ name: "", subject: "", experience: "", bio: "" });
      load();
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this faculty member from the homepage?")) return;
    const res = await fetch(`/api/admin/faculty/${id}`, { method: "DELETE" });
    toast(res.ok ? "Removed" : "Failed", res.ok ? "success" : "error");
    if (res.ok) load();
  }

  async function toggleActive(item: FacultyItem) {
    const res = await fetch(`/api/admin/faculty/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !item.isActive }),
    });
    toast(res.ok ? "Updated" : "Failed", res.ok ? "success" : "error");
    if (res.ok) load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Homepage Faculty</h2>
        <p className="text-sm text-ssa-muted mt-1">
          Faculty names appear on the public homepage only after you add them here.
        </p>
      </div>
      <form onSubmit={add} className="glass rounded-2xl p-6 space-y-4 max-w-xl">
        <input
          placeholder="Faculty name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Subject (e.g. Mathematics)"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          required
        />
        <input
          placeholder="Experience (e.g. 10+ years)"
          value={form.experience}
          onChange={(e) => setForm({ ...form, experience: e.target.value })}
          required
        />
        <textarea
          placeholder="Short bio (optional)"
          rows={2}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
        <button type="submit" className="btn-primary">Add Faculty</button>
      </form>
      <div className="space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-ssa-muted">No faculty on homepage yet. Add members above to display them publicly.</p>
        )}
        {items.map((f) => (
          <div key={f.id} className="glass rounded-xl p-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-semibold">{f.name}</p>
              <p className="text-sm text-ssa-primary">{f.subject}</p>
              <p className="text-xs text-ssa-muted mt-1">{f.experience}</p>
              {!f.isActive && <p className="text-xs text-ssa-accent mt-1">Hidden from homepage</p>}
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn-ghost text-sm py-1 px-3" onClick={() => toggleActive(f)}>
                {f.isActive ? "Hide" : "Show"}
              </button>
              <button type="button" className="btn-ghost text-sm py-1 px-3 text-ssa-accent" onClick={() => remove(f.id)}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
