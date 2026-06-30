"use client";

import { CrudPanel } from "@/components/admin/CrudPanel";
import { CLASS_LEVELS } from "@/lib/academy";

export default function AdminStudentsPage() {
  return (
    <CrudPanel
      apiPath="/api/admin/students"
      title="Manage Students"
      fields={[
        { key: "name", label: "Student Name" },
        {
          key: "classLevel",
          label: "Class",
          type: "select",
          options: CLASS_LEVELS.map((c) => ({ value: c, label: c })),
        },
        { key: "parentName", label: "Parent Name" },
        { key: "parentPhone", label: "Parent Phone" },
        { key: "totalFees", label: "Total Fees", type: "number" },
        { key: "phone", label: "Student Phone" },
      ]}
      columns={["Name", "Username", "Class"]}
      mapRow={(s) => {
        const st = s as {
          user: { name: string; username: string };
          classLevel: string;
        };
        return [st.user.name, st.user.username, st.classLevel];
      }}
    />
  );
}
