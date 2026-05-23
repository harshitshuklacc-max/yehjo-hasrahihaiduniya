"use client";

import { useEffect, useState } from "react";
import { CrudPanel } from "@/components/admin/CrudPanel";

export default function AdminStudentsPage() {
  const [batches, setBatches] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetch("/api/admin/batches")
      .then((r) => r.json())
      .then((b: { id: string; name: string }[]) =>
        setBatches(b.map((x) => ({ value: x.id, label: x.name })))
      );
  }, []);

  return (
    <CrudPanel
      apiPath="/api/admin/students"
      title="Manage Students"
      fields={[
        { key: "name", label: "Student Name" },
        { key: "classLevel", label: "Class (e.g. 10th)" },
        { key: "parentName", label: "Parent Name" },
        { key: "parentPhone", label: "Parent Phone" },
        { key: "batchId", label: "Batch", type: "select", options: batches },
        { key: "totalFees", label: "Total Fees", type: "number" },
        { key: "phone", label: "Student Phone" },
      ]}
      columns={["Name", "Username", "Class", "Batch"]}
      mapRow={(s) => {
        const st = s as {
          user: { name: string; username: string };
          classLevel: string;
          batch?: { name: string };
        };
        return [st.user.name, st.user.username, st.classLevel, st.batch?.name || "-"];
      }}
    />
  );
}
