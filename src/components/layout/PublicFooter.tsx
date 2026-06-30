import Link from "next/link";
import { ACADEMY } from "@/lib/academy";
import { Logo } from "@/components/ui/Logo";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-ssa-surface/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <Logo href="/" size={48} />
          <p className="mt-4 max-w-md text-sm text-ssa-muted leading-relaxed">
            {ACADEMY.tagline}. Premier coaching for Classes 5–12 in Bilaspur with experienced faculty
            and result-oriented learning.
          </p>
          <div className="mt-4">
            <a
              href={ACADEMY.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg glass px-3 py-1.5 text-xs hover:text-ssa-primary"
            >
              @{ACADEMY.instagramHandle}
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-ssa-muted">
            <li><a href="#about">About</a></li>
            <li><a href="#courses">Courses</a></li>
            <li><Link href="/login">Portal Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-ssa-muted">
            <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-ssa-primary" />{ACADEMY.address}</li>
            <li className="flex gap-2">
              <Phone className="h-4 w-4 shrink-0 text-ssa-primary" />
              <span>
                <a href={`tel:${ACADEMY.phone}`}>{ACADEMY.phone}</a>
                {" · "}
                <a href={`tel:${ACADEMY.phone2}`}>{ACADEMY.phone2}</a>
              </span>
            </li>
            <li className="flex gap-2"><Clock className="h-4 w-4 shrink-0 text-ssa-primary" />{ACADEMY.timings}</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0 text-ssa-primary" /><a href={`mailto:${ACADEMY.email}`}>{ACADEMY.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-ssa-muted">
        © {new Date().getFullYear()} {ACADEMY.name}. All rights reserved. · Bilaspur, Chhattisgarh
      </div>
    </footer>
  );
}
