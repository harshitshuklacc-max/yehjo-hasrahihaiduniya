import { AttendanceReportsView } from "@/components/attendance/AttendanceReportsView";

export default function TeacherAttendancePage() {
  return <AttendanceReportsView apiBase="/api/teacher/attendance" />;
}
