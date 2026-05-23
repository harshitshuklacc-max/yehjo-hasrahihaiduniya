import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { adminNav } from "@/lib/nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell nav={adminNav} role="admin" title="Admin Dashboard">
      {children}
    </DashboardShell>
  );
}
