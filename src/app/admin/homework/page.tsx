"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

export default function AdminHomeworkPage() {
  const [items, setItems] = useState<
    { id: string; title: string; dueDate: string; classLevel: string; teacher: { user: { name: string } } }[]
  >([]);

  useEffect(() => {
    fetch("/api/admin/homework").then((r) => r.json()).then(setItems);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Homework Activity</h2>
      <div className="space-y-3">
        {items.map((h) => (
          <div key={h.id} className="glass rounded-xl p-4 flex flex-wrap justify-between gap-2">
            <div>
              <p className="font-semibold">{h.title}</p>
              <p className="text-xs text-ssa-muted">{h.classLevel} · {h.teacher.user.name}</p>
            </div>
            <span className="text-xs text-ssa-accent">Due {formatDate(h.dueDate)}</span>
          </div>
        ))}
        {items.length === 0 && <p className="text-ssa-muted">No homework posted yet.</p>}
      </div>
    </div>
  );
}
