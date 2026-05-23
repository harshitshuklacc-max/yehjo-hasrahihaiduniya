"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { Plus, Trash2, Search } from "lucide-react";

type Field = {
  key: string;
  label: string;
  type?: "text" | "number" | "select" | "password";
  options?: { value: string; label: string }[];
};

export function CrudPanel({
  apiPath,
  title,
  fields,
  columns,
  mapRow,
}: {
  apiPath: string;
  title: string;
  fields: Field[];
  columns: string[];
  mapRow: (item: Record<string, unknown>) => (string | number)[];
}) {
  const { toast } = useToast();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState<Record<string, string>>({});
  const [creds, setCreds] = useState<string | null>(null);

  function load() {
    fetch(`${apiPath}?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then(setItems);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, apiPath]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const body: Record<string, unknown> = {};
    fields.forEach((f) => {
      const v = form[f.key];
      if (v) body[f.key] = f.type === "number" ? Number(v) : v;
    });
    const res = await fetch(apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) {
      toast("Created successfully", "success");
      if (data.generatedPassword) {
        setCreds(`Username: ${data.user?.username}\nPassword: ${data.generatedPassword}`);
      }
      setForm({});
      load();
    } else toast(data.error || "Failed", "error");
  }

  async function remove(id: string) {
    if (!confirm("Delete this record?")) return;
    const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Deleted", "success");
      load();
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      {creds && (
        <pre className="glass rounded-xl p-4 text-sm text-ssa-success whitespace-pre-wrap">{creds}</pre>
      )}
      <form onSubmit={create} className="glass rounded-2xl p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((f) =>
          f.type === "select" ? (
            <select
              key={f.key}
              value={form[f.key] || ""}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            >
              <option value="">{f.label}</option>
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              key={f.key}
              type={f.type || "text"}
              placeholder={f.label}
              value={form[f.key] || ""}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            />
          )
        )}
        <button type="submit" className="btn-primary sm:col-span-2 lg:col-span-1">
          <Plus className="h-4 w-4" /> Add New
        </button>
      </form>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ssa-muted" />
        <input
          className="pl-10"
          placeholder="Search..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="glass rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-ssa-muted">
              {columns.map((c) => (
                <th key={c} className="p-4 font-medium">
                  {c}
                </th>
              ))}
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const id = (item as { id: string }).id;
              const row = mapRow(item);
              return (
                <tr key={id} className="border-b border-white/5 hover:bg-white/5">
                  {row.map((cell, i) => (
                    <td key={i} className="p-4">
                      {cell}
                    </td>
                  ))}
                  <td className="p-4">
                    <button type="button" onClick={() => remove(id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
