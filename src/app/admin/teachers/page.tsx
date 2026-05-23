"use client";

import { CrudPanel } from "@/components/admin/CrudPanel";

export default function AdminTeachersPage() {
  return (
    <CrudPanel
      apiPath="/api/admin/teachers"
      title="Manage Teachers"
      fields={[
        { key: "name", label: "Full Name" },
        { key: "subject", label: "Subject" },
        { key: "qualification", label: "Qualification" },
        { key: "experience", label: "Experience" },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
      ]}
      columns={["Name", "Username", "Subject", "Phone"]}
      mapRow={(t) => {
        const u = (t as { user: { name: string; username: string; phone?: string } }).user;
        return [u.name, u.username, (t as { subject?: string }).subject || "-", u.phone || "-"];
      }}
    />
  );
}
