import { AttendanceReportsView } from "@/components/attendance/AttendanceReportsView";

export default function StudentAttendancePage() {
  return <AttendanceReportsView apiBase="/api/student/attendance" />;
}
