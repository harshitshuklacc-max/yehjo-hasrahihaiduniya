"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { formatDate } from "@/lib/utils";

export default function AdminAnnouncementsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<{ id: string; title: string; body: string; createdAt: string }[]>([]);
  const [form, setForm] = useState({ title: "", body: "" });

  function load() {
    fetch("/api/admin/announcements").then((r) => r.json()).then(setItems);
  }

  useEffect(() => { load(); }, []);

  async function post(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    toast(res.ok ? "Notice published" : "Failed", res.ok ? "success" : "error");
    if (res.ok) {
      setForm({ title: "", body: "" });
      load();
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Announcements</h2>
      <form onSubmit={post} className="glass rounded-2xl p-6 space-y-4 max-w-xl">
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea placeholder="Notice body" rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
        <button type="submit" className="btn-primary">Publish Notice</button>
      </form>
      <div className="space-y-3">
        {items.map((a) => (
          <div key={a.id} className="glass rounded-xl p-4">
            <p className="font-semibold">{a.title}</p>
            <p className="text-sm text-ssa-muted mt-1">{a.body}</p>
            <p className="text-xs text-ssa-muted mt-2">{formatDate(a.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
