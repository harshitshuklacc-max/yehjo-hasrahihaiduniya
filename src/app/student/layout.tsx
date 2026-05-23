import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { studentNav } from "@/lib/nav";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell nav={studentNav} role="student" title="Student Portal">
      {children}
    </DashboardShell>
  );
}
