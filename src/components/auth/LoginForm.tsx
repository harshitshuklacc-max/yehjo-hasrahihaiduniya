"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ACADEMY } from "@/lib/academy";
import { useToast } from "@/components/providers/ToastProvider";

export function LoginForm({
  role,
  title,
  redirectTo,
}: {
  role: "admin" | "teacher" | "student";
  title: string;
  redirectTo: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/auth/${role}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: form.get("identifier"),
          password: form.get("password"),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast("Welcome back!", "success");
        router.push(redirectTo);
      } else {
        setError(data.error || `Login failed (${res.status})`);
      }
    } catch {
      setError(
        "Cannot connect to server. Make sure the app is running (npm run dev or start.bat) at http://localhost:3000"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center gradient-hero px-4">
      <form onSubmit={login} className="glass-strong w-full max-w-md rounded-3xl p-8">
        <div className="flex flex-col items-center mb-6">
          <Image src={ACADEMY.logo} alt={ACADEMY.name} width={72} height={72} className="rounded-2xl" />
          <h1 className="mt-4 text-2xl font-bold gradient-text">{ACADEMY.shortName}</h1>
          <p className="text-sm text-ssa-muted mt-1">{title}</p>
        </div>
        <input name="identifier" placeholder="Username" required autoComplete="username" />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="mt-4"
          required
          autoComplete="current-password"
        />
        {error && <p className="mt-3 text-center text-sm text-red-400">{error}</p>}
        <button type="submit" className="btn-primary mt-6 w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p className="mt-6 text-center text-xs text-ssa-muted">
          <Link href="/login" className="hover:text-ssa-primary">← Back to portal selection</Link>
          {" · "}
          <Link href="/" className="hover:text-ssa-primary">Home</Link>
        </p>
      </form>
    </div>
  );
}
