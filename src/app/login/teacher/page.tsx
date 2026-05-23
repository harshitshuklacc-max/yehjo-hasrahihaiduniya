import { LoginForm } from "@/components/auth/LoginForm";

export default function TeacherLoginPage() {
  return <LoginForm role="teacher" title="Teacher Portal" redirectTo="/teacher" />;
}
