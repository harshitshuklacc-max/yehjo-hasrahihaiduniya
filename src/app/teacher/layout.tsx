import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { teacherNav } from "@/lib/nav";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell nav={teacherNav} role="teacher" title="Teacher Portal">
      {children}
    </DashboardShell>
  );
}
