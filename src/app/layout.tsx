import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { ACADEMY } from "@/lib/academy";

export const metadata: Metadata = {
  title: {
    default: `${ACADEMY.name} | Premium Coaching Bilaspur`,
    template: `%s | ${ACADEMY.shortName}`,
  },
  description:
    "Smart Step Academy — Bilaspur's premier coaching for Classes 5–12. 4.9★ rated institute with experienced faculty and result-oriented learning.",
  keywords: [
    "Smart Step Academy",
    "coaching Bilaspur",
    "commerce coaching Chhattisgarh",
    "classes 5 to 12 Bilaspur",
  ],
  icons: { icon: ACADEMY.favicon, apple: ACADEMY.favicon },
  openGraph: {
    title: ACADEMY.name,
    description: ACADEMY.tagline,
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
