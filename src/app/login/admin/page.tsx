import { LoginForm } from "@/components/auth/LoginForm";

export default function AdminLoginPage() {
  return <LoginForm role="admin" title="Admin Portal" redirectTo="/admin" />;
}
