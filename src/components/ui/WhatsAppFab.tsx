"use client";

import { MessageCircle } from "lucide-react";
import { ACADEMY } from "@/lib/academy";

export function WhatsAppFab() {
  return (
    <a
      href={ACADEMY.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
