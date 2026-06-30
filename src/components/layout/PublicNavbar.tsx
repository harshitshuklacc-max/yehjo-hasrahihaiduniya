"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useTheme } from "@/components/providers/ThemeProvider";

const baseLinks = [
  { href: "#about", label: "About" },
  { href: "#courses", label: "Courses" },
  { href: "#faculty", label: "Faculty" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

export function PublicNavbar({ showFaculty = false }: { showFaculty?: boolean }) {
  const links = showFaculty ? baseLinks : baseLinks.filter((l) => l.href !== "#faculty");
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Logo size={44} />
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-ssa-muted hover:text-ssa-primary transition">
              {l.label}
            </a>
          ))}
          <Link href="/login" className="btn-primary text-sm py-2 px-5">
            Portal Login
          </Link>
          <button type="button" onClick={toggle} className="rounded-lg p-2 hover:bg-white/5" aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <button type="button" onClick={toggle} className="p-2">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button type="button" onClick={() => setOpen(!open)} className="p-2">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="glass border-t border-white/10 px-4 py-4 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm"
            >
              {l.label}
            </a>
          ))}
          <Link href="/login" className="btn-primary mt-3 w-full text-center text-sm" onClick={() => setOpen(false)}>
            Portal Login
          </Link>
        </div>
      )}
    </header>
  );
}
