"use client";

import { useEffect, useState } from "react";

export default function TeacherBatchesPage() {
  const [batches, setBatches] = useState<
    { name: string; students: { user: { name: string; username: string } }[] }[]
  >([]);

  useEffect(() => {
    fetch("/api/teacher/batches").then((r) => r.json()).then(setBatches);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Batches & Students</h2>
      {batches.map((b) => (
        <div key={b.name} className="glass rounded-2xl p-6">
          <h3 className="font-bold text-lg">{b.name}</h3>
          <ul className="mt-4 space-y-2">
            {b.students?.map((s) => (
              <li key={s.user.username} className="text-sm flex justify-between border-b border-white/5 pb-2">
                <span>{s.user.name}</span>
                <span className="text-ssa-muted">{s.user.username}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
