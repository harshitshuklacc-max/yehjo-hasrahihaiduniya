import Image from "next/image";
import Link from "next/link";
import { ACADEMY } from "@/lib/academy";
import { cn } from "@/lib/utils";

export function Logo({
  size = 40,
  showText = true,
  href = "/",
  className,
}: {
  size?: number;
  showText?: boolean;
  href?: string;
  className?: string;
}) {
  const content = (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src={ACADEMY.logo}
        alt={ACADEMY.name}
        width={size}
        height={size}
        className="rounded-xl"
        priority
      />
      {showText && (
        <div className="leading-tight">
          <span className="block text-sm font-bold tracking-tight">Smart Step</span>
          <span className="block text-[10px] uppercase tracking-[0.2em] text-ssa-muted">
            Academy
          </span>
        </div>
      )}
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
