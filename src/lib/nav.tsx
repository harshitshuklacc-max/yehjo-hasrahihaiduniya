import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCircle,
  Calendar,
  IndianRupee,
  Megaphone,
  ClipboardList,
  Archive,
  BookOpen,
  FileText,
  CalendarDays,
  User,
  ClipboardCheck,
} from "lucide-react";
import type { NavItem } from "@/components/dashboard/DashboardShell";

export const adminNav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/admin/teachers", label: "Teachers", icon: <GraduationCap className="h-4 w-4" /> },
  { href: "/admin/faculty", label: "Homepage Faculty", icon: <UserCircle className="h-4 w-4" /> },
  { href: "/admin/students", label: "Students", icon: <Users className="h-4 w-4" /> },
  { href: "/admin/timetable", label: "Timetable", icon: <Calendar className="h-4 w-4" /> },
  { href: "/admin/fees", label: "Fees", icon: <IndianRupee className="h-4 w-4" /> },
  { href: "/admin/homework", label: "Homework", icon: <BookOpen className="h-4 w-4" /> },
  { href: "/admin/attendance", label: "Attendance", icon: <ClipboardCheck className="h-4 w-4" /> },
  { href: "/admin/announcements", label: "Notices", icon: <Megaphone className="h-4 w-4" /> },
  { href: "/admin/leaves", label: "Leave Requests", icon: <ClipboardList className="h-4 w-4" /> },
  { href: "/admin/archive", label: "Archive", icon: <Archive className="h-4 w-4" /> },
];

export const teacherNav: NavItem[] = [
  { href: "/teacher", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/teacher/homework", label: "Homework", icon: <BookOpen className="h-4 w-4" /> },
  { href: "/teacher/materials", label: "Study Materials", icon: <FileText className="h-4 w-4" /> },
  { href: "/teacher/tests", label: "Tests", icon: <CalendarDays className="h-4 w-4" /> },
  { href: "/teacher/attendance", label: "Attendance", icon: <ClipboardCheck className="h-4 w-4" /> },
  { href: "/teacher/leave", label: "Leave", icon: <ClipboardList className="h-4 w-4" /> },
];

export const studentNav: NavItem[] = [
  { href: "/student", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/student/profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  { href: "/student/timetable", label: "Timetable", icon: <Calendar className="h-4 w-4" /> },
  { href: "/student/homework", label: "Homework", icon: <BookOpen className="h-4 w-4" /> },
  { href: "/student/attendance", label: "Attendance", icon: <ClipboardCheck className="h-4 w-4" /> },
  { href: "/student/fees", label: "Fees", icon: <IndianRupee className="h-4 w-4" /> },
  { href: "/student/tests", label: "Tests", icon: <CalendarDays className="h-4 w-4" /> },
  { href: "/student/notices", label: "Notices", icon: <Megaphone className="h-4 w-4" /> },
  { href: "/student/materials", label: "Resources", icon: <FileText className="h-4 w-4" /> },
];
