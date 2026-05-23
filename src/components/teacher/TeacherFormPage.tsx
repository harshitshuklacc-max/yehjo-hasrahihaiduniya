"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { formatDate } from "@/lib/utils";

export function TeacherHomeworkPage() {
  const { toast } = useToast();
  const [batches, setBatches] = useState<{ id: string; name: string }[]>([]);
  const [items, setItems] = useState<{ id: string; title: string; dueDate: string; batch: { name: string } }[]>([]);
  const [form, setForm] = useState({ batchId: "", title: "", description: "", dueDate: "" });

  useEffect(() => {
    fetch("/api/teacher/batches").then((r) => r.json()).then(setBatches);
    fetch("/api/teacher/homework").then((r) => r.json()).then(setItems);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/teacher/homework", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    toast(res.ok ? "Homework posted" : "Failed", res.ok ? "success" : "error");
    if (res.ok) {
      setForm({ batchId: "", title: "", description: "", dueDate: "" });
      fetch("/api/teacher/homework").then((r) => r.json()).then(setItems);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Homework</h2>
      <form onSubmit={submit} className="glass rounded-2xl p-6 space-y-4 max-w-lg">
        <select value={form.batchId} onChange={(e) => setForm({ ...form, batchId: e.target.value })} required>
          <option value="">Select batch</option>
          {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <input type="datetime-local" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
        <button type="submit" className="btn-primary">Post Homework</button>
      </form>
      <div className="space-y-3">
        {items.map((h) => (
          <div key={h.id} className="glass rounded-xl p-4">
            <p className="font-semibold">{h.title}</p>
            <p className="text-xs text-ssa-muted">{h.batch.name} · Due {formatDate(h.dueDate)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TeacherMaterialsPage() {
  const { toast } = useToast();
  const [batches, setBatches] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({ batchId: "", title: "", fileUrl: "", description: "" });

  useEffect(() => {
    fetch("/api/teacher/batches").then((r) => r.json()).then(setBatches);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/teacher/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    toast(res.ok ? "Material uploaded" : "Failed", res.ok ? "success" : "error");
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Study Materials</h2>
      <form onSubmit={submit} className="glass rounded-2xl p-6 space-y-4 max-w-lg">
        <select value={form.batchId} onChange={(e) => setForm({ ...form, batchId: e.target.value })} required>
          <option value="">Select batch</option>
          {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="File URL (PDF/Drive link)" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} required />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button type="submit" className="btn-primary">Upload Notes</button>
      </form>
    </div>
  );
}

export function TeacherTestsPage() {
  const { toast } = useToast();
  const [batches, setBatches] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({
    batchId: "", subject: "", syllabus: "", testDate: "", startTime: "", endTime: "", instructions: "",
  });

  useEffect(() => {
    fetch("/api/teacher/batches").then((r) => r.json()).then(setBatches);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/teacher/tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    toast(res.ok ? "Test scheduled" : "Failed", res.ok ? "success" : "error");
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Test Schedule</h2>
      <form onSubmit={submit} className="glass rounded-2xl p-6 grid gap-4 sm:grid-cols-2 max-w-2xl">
        <select value={form.batchId} onChange={(e) => setForm({ ...form, batchId: e.target.value })} required className="sm:col-span-2">
          <option value="">Select batch</option>
          {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
        <input type="date" value={form.testDate} onChange={(e) => setForm({ ...form, testDate: e.target.value })} required />
        <input type="time" placeholder="Start" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
        <input type="time" placeholder="End" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
        <textarea placeholder="Syllabus" className="sm:col-span-2" value={form.syllabus} onChange={(e) => setForm({ ...form, syllabus: e.target.value })} />
        <textarea placeholder="Instructions" className="sm:col-span-2" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
        <button type="submit" className="btn-primary sm:col-span-2">Schedule Test</button>
      </form>
    </div>
  );
}

export function TeacherLeavePage() {
  const { toast } = useToast();
  const [leaves, setLeaves] = useState<{ id: string; startDate: string; endDate: string; reason: string; status: string; adminRemark?: string }[]>([]);
  const [form, setForm] = useState({ startDate: "", endDate: "", reason: "" });

  function load() {
    fetch("/api/teacher/leaves").then((r) => r.json()).then(setLeaves);
  }

  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/teacher/leaves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    toast(res.ok ? "Leave submitted" : "Failed", res.ok ? "success" : "error");
    if (res.ok) {
      setForm({ startDate: "", endDate: "", reason: "" });
      load();
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Leave Management</h2>
      <form onSubmit={submit} className="glass rounded-2xl p-6 space-y-4 max-w-lg">
        <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
        <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
        <textarea placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required rows={3} />
        <button type="submit" className="btn-primary">Submit Leave Request</button>
      </form>
      <div className="space-y-3">
        {leaves.map((l) => (
          <div key={l.id} className="glass rounded-xl p-4">
            <p className="font-medium">{formatDate(l.startDate)} — {formatDate(l.endDate)}</p>
            <p className="text-sm text-ssa-muted">{l.reason}</p>
            <span className="text-xs mt-2 inline-block px-2 py-0.5 rounded bg-ssa-primary/20">{l.status}</span>
            {l.adminRemark && <p className="text-xs mt-2 text-ssa-muted">Admin: {l.adminRemark}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
