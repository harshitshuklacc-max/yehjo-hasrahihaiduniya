"use client";

import Image from "next/image";
import { ACADEMY } from "@/lib/academy";

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-ssa-bg">
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-ssa-primary/20" />
        <Image
          src={ACADEMY.logo}
          alt={ACADEMY.name}
          width={80}
          height={80}
          className="relative animate-spin-slow rounded-2xl"
          priority
        />
      </div>
      <p className="mt-6 text-sm font-medium text-ssa-muted loading-shimmer px-8 py-1 rounded">
        Loading {ACADEMY.shortName}...
      </p>
    </div>
  );
}
