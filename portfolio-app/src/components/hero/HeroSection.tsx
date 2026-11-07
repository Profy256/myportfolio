"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowUpRight, Download, MapPin } from "lucide-react";
import { LinkButton } from "@/components/ui/Primitives";
import { CountUp, Reveal } from "@/components/ui/Motion";

const Badge = dynamic(
  () => import("@/components/hero/HeroBadge3D").then((m) => m.HeroBadge3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-40 w-32 animate-pulse rounded-2xl border border-[var(--line)] bg-[var(--panel)]" />
      </div>
    ),
  }
);

const ROLES = [
  "Full-stack engineer — Go, TypeScript, Next.js",
  "AI & data engineer — Python, Go, real-time systems",
  "3D web creative — react-three, WebGL, motion",
  "Multi-tenant SaaS architect — PostgreSQL, Docker",
];

const MARQUEE = [
  "Go",
  "TypeScript",
  "Next.js",
  "React",
  "PostgreSQL",
  "Python",
  "Docker",
  "Prisma",
  "Tailwind",
  "React Native",
  "Linux",
  "Supabase",
];

const STATS = [
  { value: 25, suffix: "+", label: "Projects shipped" },
  { value: 14, suffix: "", label: "Certificates earned" },
  { value: 3, suffix: "", label: "Awards won" },
];

function useTypewriter() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(ROLES[0]);
  const [phase, setPhase] = useState<"typing" | "hold" | "deleting">("hold");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(ROLES[0]);
      setPhase("hold");
      return;
    }
    const full = ROLES[index];
    let timer: number;

    if (phase === "typing") {
      if (text.length < full.length) {
        timer = window.setTimeout(() => setText(full.slice(0, text.length + 1)), 38);
      } else {
        timer = window.setTimeout(() => setPhase("hold"), 1800);
      }
    } else if (phase === "hold") {
      timer = window.setTimeout(() => setPhase("deleting"), 2200);
    } else {
      if (text.length > 0) {
        timer = window.setTimeout(() => setText(full.slice(0, text.length - 1)), 18);
      } else {
        timer = window.setTimeout(() => {
          setIndex((i) => (i + 1) % ROLES.length);
          setPhase("typing");
        }, 260);
      }
    }
    return () => window.clearTimeout(timer);
  }, [phase, text, index]);

  return text;
}

export function HeroSection() {
  const typed = useTypewriter();

  return (
    <section
      id="home"
      className="relative z-10 flex min-h-[100svh] flex-col justify-center px-5 pt-28 pb-10 md:px-8 md:pt-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          {/* ---------------- copy ---------------- */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--panel)] px-3 py-1.5 backdrop-blur-md">
                <span className="dot" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                  Available for work
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
                <MapPin className="h-3 w-3" />
                Kampala, Uganda
              </span>
            </div>

            <h1 className="display-xl mt-6">
              <span className="line-mask">
                <span style={{ animationDelay: "80ms" }}>Kafeero</span>
              </span>
              <span className="line-mask">
                <span
                  className="serif-accent block pr-3 text-[clamp(3rem,8.8vw,6.6rem)]"
                  style={{ animationDelay: "200ms", lineHeight: 0.98 }}
                >
                  Proferious
                </span>
              </span>
            </h1>

            <div className="mt-6 flex h-7 items-center font-mono text-[13px] text-[var(--ink-muted)] md:text-sm">
              <span className="mr-2 text-[var(--glow-accent)]">›</span>
              <span>{typed}</span>
              <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-[var(--glow-accent)]" />
            </div>

            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-[var(--ink-softer)]">
              I design and ship products end to end — architecture, interface and brand.
              Marketplaces, AI platforms and developer tools that people actually use.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <LinkButton href="#portfolio" size="md" className="min-w-[168px]">
                View selected work
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </LinkButton>
              <LinkButton href="/contact" variant="ghost" size="md">
                Get in touch
              </LinkButton>
              <Link
                href="/assets/Kafeero-Proferious-CV.pdf"
                download
                className="group inline-flex items-center gap-2 px-2 py-2 text-sm font-medium text-[var(--ink-softer)] transition-colors hover:text-[var(--ink)]"
              >
                <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                CV
              </Link>
            </div>
          </div>

          {/* ---------------- 3d badge ---------------- */}
          <div className="relative mx-auto h-[360px] w-full max-w-[440px] sm:h-[440px] lg:h-[540px]">
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(214,255,63,0.16), rgba(167,139,250,0.12) 45%, transparent 70%)",
              }}
            />
            <div className="relative h-full w-full">
              <Badge />
            </div>

            <span className="absolute -left-2 top-[14%] hidden animate-floaty rounded-full border border-[var(--line-strong)] bg-[var(--panel)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-muted)] backdrop-blur-md sm:block lg:-left-6">
              Go · Next.js
            </span>
            <span
              className="absolute -right-2 top-[68%] hidden animate-floaty rounded-full border border-[var(--line-strong)] bg-[var(--panel)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-muted)] backdrop-blur-md sm:block lg:-right-6"
              style={{ animationDelay: "-2.4s" }}
            >
              AI infra
            </span>
            <span
              className="absolute bottom-[6%] left-0 hidden animate-floaty rounded-full border border-[var(--line-strong)] bg-[var(--panel)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-muted)] backdrop-blur-md sm:block lg:-left-3"
              style={{ animationDelay: "-4.2s" }}
            >
              PostgreSQL
            </span>
          </div>
        </div>

        {/* ---------------- stats ---------------- */}
        <Reveal className="mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] md:mt-16">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-[var(--space)] px-4 py-5 md:px-6 md:py-6">
              <p className="font-display text-2xl font-bold leading-none tracking-tight text-[var(--ink)] md:text-3xl">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase leading-tight tracking-[0.16em] text-[var(--ink-faint)]">
                {stat.label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>

      {/* ---------------- marquee ---------------- */}
      <div className="relative mt-12 overflow-hidden border-y border-[var(--line)] py-3.5 md:mt-16">
        <div className="marquee-track gap-8">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex shrink-0 items-center gap-8 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ink-faint)]"
            >
              {item}
              <span className="h-1 w-1 rounded-full bg-[var(--glow-accent)]/60" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
