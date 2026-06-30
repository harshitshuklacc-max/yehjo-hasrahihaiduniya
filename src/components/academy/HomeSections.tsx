"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Trophy,
  Users,
  Heart,
  Target,
  Sparkles,
  Shield,
  BookOpen,
  GraduationCap,
  Phone,
  ArrowRight,
  Mail,
} from "lucide-react";
import { ACADEMY, COURSES, WHY_CHOOSE, STATS } from "@/lib/academy";

const iconMap: Record<string, React.ElementType> = {
  trophy: Trophy,
  users: Users,
  heart: Heart,
  target: Target,
  sparkles: Sparkles,
  shield: Shield,
  book: BookOpen,
  graduation: GraduationCap,
};

type Faculty = { id: string; name: string; subject: string; experience: string; bio: string | null };
type Testimonial = { id: string; author: string; role: string; rating: number; content: string };

export function HomeSections({
  faculty,
  testimonials,
}: {
  faculty: Faculty[];
  testimonials: Testimonial[];
}) {
  return (
    <>
      <section className="gradient-hero relative min-h-screen flex items-center pt-24 pb-16 px-4 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm mb-6">
              <Star className="h-4 w-4 fill-ssa-accent text-ssa-accent" />
              <span>{ACADEMY.rating}/5 · {ACADEMY.reviewCount}+ Google Reviews</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Shape Your Future at{" "}
              <span className="gradient-text">{ACADEMY.shortName}</span>
            </h1>
            <p className="mt-6 text-lg text-ssa-muted max-w-xl">
              Bilaspur&apos;s premier coaching institute for Classes 5–10 and 11th–12th Commerce.
              Quality education, experienced faculty, and personalized mentorship.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#contact" className="btn-primary">
                Enroll Now <ArrowRight className="h-4 w-4" />
              </a>
              <a href={`tel:${ACADEMY.phone}`} className="btn-ghost">
                <Phone className="h-4 w-4" /> Call Us
              </a>
              <Link href="/login" className="btn-ghost">Student Portal</Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="glass-strong rounded-3xl p-8 animate-float">
              <Image src={ACADEMY.logo} alt={ACADEMY.name} width={280} height={280} className="rounded-2xl" priority />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4 md:px-6 border-y border-white/5">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="stat-card text-center card-hover"
            >
              <p className="text-2xl font-bold gradient-text md:text-3xl">{s.value}</p>
              <p className="text-sm font-medium mt-1">{s.label}</p>
              <p className="text-xs text-ssa-muted">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="about" className="py-20 px-4 md:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold md:text-4xl text-center mb-4">About <span className="gradient-text">{ACADEMY.name}</span></h2>
          <p className="text-center text-ssa-muted max-w-2xl mx-auto mb-12">
            A highly rated coaching institute in Bilaspur focused on academic excellence, student-focused learning,
            and friendly cooperative management.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {["Experienced Faculty", "Quality Education", "Strong Academic Guidance"].map((t) => (
              <div key={t} className="glass rounded-2xl p-6 card-hover">
                <h3 className="font-semibold text-lg">{t}</h3>
                <p className="mt-2 text-sm text-ssa-muted">
                  Excellence-driven programs with regular assessments and supportive learning culture.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="courses" className="py-20 px-4 md:px-6 bg-ssa-surface/30">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">Courses & Programs</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {COURSES.map((c) => {
              const Icon = c.icon === "graduation" ? GraduationCap : BookOpen;
              return (
                <div key={c.title} className="glass-strong rounded-2xl p-8 card-hover">
                  <Icon className="h-10 w-10 text-ssa-primary mb-4" />
                  <h3 className="text-xl font-bold">{c.title}</h3>
                  {"stream" in c && <span className="text-xs text-ssa-accent uppercase tracking-wider">{c.stream}</span>}
                  <p className="mt-3 text-ssa-muted">{c.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {c.highlights.map((h) => (
                      <li key={h} className="rounded-full bg-ssa-primary/10 px-3 py-1 text-xs">{h}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="why" className="py-20 px-4 md:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_CHOOSE.map((w, i) => {
              const Icon = iconMap[w.icon] || Sparkles;
              return (
                <motion.div
                  key={w.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl p-6 card-hover"
                >
                  <Icon className="h-8 w-8 text-ssa-secondary mb-3" />
                  <h3 className="font-semibold">{w.title}</h3>
                  <p className="mt-2 text-sm text-ssa-muted">{w.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {faculty.length > 0 && (
      <section id="faculty" className="py-20 px-4 md:px-6 bg-ssa-surface/30">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">Our Faculty</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {faculty.map((f) => (
              <div key={f.id} className="glass rounded-2xl p-6 text-center card-hover">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-ssa-primary to-ssa-secondary text-2xl font-bold">
                  {f.name.charAt(0)}
                </div>
                <h3 className="font-semibold">{f.name}</h3>
                <p className="text-sm text-ssa-primary">{f.subject}</p>
                <p className="text-xs text-ssa-muted mt-1">{f.experience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      <section id="reviews" className="py-20 px-4 md:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">Student & Parent Reviews</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.id} className="glass rounded-2xl p-6 card-hover">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-ssa-accent text-ssa-accent" />
                  ))}
                </div>
                <p className="text-sm text-ssa-muted italic">&ldquo;{t.content}&rdquo;</p>
                <p className="mt-4 font-semibold text-sm">{t.author}</p>
                <p className="text-xs text-ssa-muted">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-4 md:px-6">
        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
            <p className="text-ssa-muted mb-6">{ACADEMY.address}</p>
            <a href={`tel:${ACADEMY.phone}`} className="btn-primary inline-flex mb-4">
              <Phone className="h-4 w-4" /> {ACADEMY.phone}
            </a>
            <a href={`tel:${ACADEMY.phone2}`} className="btn-ghost inline-flex mb-4 ml-0 md:ml-3">
              <Phone className="h-4 w-4" /> {ACADEMY.phone2}
            </a>
            <a href={`mailto:${ACADEMY.email}`} className="flex items-center gap-2 text-sm text-ssa-muted mb-4 hover:text-ssa-primary">
              <Mail className="h-4 w-4 text-ssa-primary" /> {ACADEMY.email}
            </a>
            <p className="text-sm text-ssa-muted">{ACADEMY.timings}</p>
            <a
              href={ACADEMY.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost mt-4 inline-flex"
            >
              WhatsApp Us
            </a>
          </div>
          <div className="glass rounded-2xl overflow-hidden h-80 min-h-[320px]">
            <iframe
              title="Smart Step Academy Location"
              src={ACADEMY.mapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
