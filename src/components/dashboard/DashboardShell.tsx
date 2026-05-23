"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { LogOut, Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";

export type NavItem = { href: string; label: string; icon?: React.ReactNode };

export function DashboardShell({
  children,
  nav,
  role,
  title,
}: {
  children: React.ReactNode;
  nav: NavItem[];
  role: "admin" | "teacher" | "student";
  title: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function logout() {
    await fetch(`/api/auth/${role}/logout`, { method: "POST" });
    router.push(`/login/${role}`);
  }

  return (
    <div className="flex min-h-screen bg-ssa-bg">
      <aside
        className={cn(
          "dashboard-sidebar fixed inset-y-0 left-0 z-40 w-64 transform transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col p-4">
          <Logo href={`/${role}`} size={36} />
          <p className="mt-2 text-xs text-ssa-muted uppercase tracking-wider">{title}</p>
          <nav className="mt-8 flex-1 space-y-1 overflow-y-auto">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  pathname === item.href
                    ? "bg-ssa-primary/20 text-ssa-primary font-medium"
                    : "text-ssa-muted hover:bg-white/5 hover:text-ssa-text"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={logout}
            className="mt-4 flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="glass sticky top-0 z-20 flex items-center justify-between px-4 py-3 lg:px-8">
          <button type="button" className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold truncate">{title}</h1>
          <button type="button" onClick={toggle} className="rounded-lg p-2 hover:bg-white/5">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
