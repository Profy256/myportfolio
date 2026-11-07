"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { SectionHead } from "@/components/ui/Primitives";
import { CountUp, Reveal } from "@/components/ui/Motion";

const EDUCATION = [
  {
    id: "uni",
    date: "2026 — present",
    title: "B.Sc. Software Engineering",
    org: "Kampala International University — Kampala, Uganda",
    focus: "Building and shipping production platforms alongside coursework.",
  },
];

const EXPERIENCE = [
  {
    id: "goheza",
    date: "Mar — Apr 2026",
    title: "Goheza Digital Marketing Training Program",
    org: "National Innovation Hub",
    focus: "Branding, graphic design, copywriting and digital marketing strategy.",
  },
  {
    id: "ict-club",
    date: "2023 — 2024",
    title: "Vice President — ICT Club",
    org: "Blessed Sacrament SS Kimanya, A-Level",
    focus: "Led ICT Club workshops, events and inter-school technology competitions.",
  },
  {
    id: "alevel",
    date: "2023 — 2024",
    title: "A-Level Certificate",
    org: "Blessed Sacrament SS Kimanya — Masaka, Uganda",
    focus: "Mathematics, Economics, Physics and ICT.",
  },
];

/** Portrait card that tilts in 3D toward the pointer, with a moving glare. */
function TiltPortrait() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState("");
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt(
      `rotateY(${(px - 0.5) * 14}deg) rotateX(${(0.5 - py) * 14}deg) translateZ(0)`
    );
    setGlare({ x: px * 100, y: py * 100, opacity: 1 });
  };

  const handleLeave = () => {
    setTilt("rotateY(0deg) rotateX(0deg)");
    setGlare((g) => ({ ...g, opacity: 0 }));
  };

  return (
    <div className="perspective-1200">
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="tilt-card group relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-[var(--line-strong)] bg-[var(--space-raised)]"
        style={{ transform: tilt || "rotateY(0deg) rotateX(0deg)" }}
      >
        <Image
          src="/portrait.jpg"
          alt="Kafeero Proferious"
          fill
          priority
          sizes="(max-width: 1024px) 90vw, 420px"
          className="object-cover object-[center_32%] transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#05070c] via-[#05070c]/25 to-transparent" />

        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(400px circle at ${glare.x}% ${glare.y}%, rgba(214,255,63,0.16), transparent 55%)`,
          }}
        />

        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-white/80 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--glow-accent)]" />
          Open to work
        </div>

        <div className="absolute inset-x-5 bottom-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--glow-accent)]">
            Kampala · UG
          </p>
          <p className="mt-1 font-display text-xl font-bold leading-tight text-white">
            Kafeero Proferious
          </p>
          <p className="mt-0.5 text-[13px] text-white/70">
            Software Engineer · Brand &amp; systems
          </p>
        </div>

        <span className="pointer-events-none absolute right-5 top-5 h-8 w-8 rounded-tr-xl border-r border-t border-white/25" />
        <span className="pointer-events-none absolute bottom-5 left-5 h-8 w-8 rounded-bl-xl border-b border-l border-white/25" />
      </div>
    </div>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="relative scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          eyebrow="01 — About"
          title={
            <>
              Engineering with a <span className="serif-accent">designer&apos;s</span> eye.
            </>
          }
          note="My work sits where backend engineering meets brand craft — because I trained in both, and I don't think a product should have to choose."
        />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <TiltPortrait />

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { value: 25, suffix: "+", label: "Projects" },
                { value: 14, suffix: "", label: "Certs" },
                { value: 3, suffix: "", label: "Awards" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-4 text-center backdrop-blur-md"
                >
                  <p className="font-display text-2xl font-bold leading-none text-[var(--ink)]">
                    <CountUp target={m.value} suffix={m.suffix} />
                  </p>
                  <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="space-y-6 lg:col-span-7">
            <Reveal delay={80}>
              <p className="font-serif text-2xl italic leading-snug text-[var(--ink)] md:text-[28px]">
                &ldquo;I ship things that are useful first, pretty second — with a preference for
                boring, resilient engineering.&rdquo;
              </p>
            </Reveal>

            <Reveal delay={140}>
              <div className="space-y-4 text-[15px] leading-relaxed text-[var(--ink-softer)]">
                <p>
                  I&apos;m a Software Engineering student at{" "}
                  <strong className="font-semibold text-[var(--ink)]">
                    Kampala International University
                  </strong>
                  , finishing my degree while building and shipping production platforms on the
                  side. The engineering runs deep and wide:{" "}
                  <strong className="font-semibold text-[var(--ink)]">Go</strong> and{" "}
                  <strong className="font-semibold text-[var(--ink)]">Java/Spring Boot</strong>{" "}
                  services, <strong className="font-semibold text-[var(--ink)]">Next.js</strong> and{" "}
                  <strong className="font-semibold text-[var(--ink)]">TypeScript</strong> front ends,{" "}
                  <strong className="font-semibold text-[var(--ink)]">React Native</strong> mobile
                  apps, <strong className="font-semibold text-[var(--ink)]">Python</strong> for data
                  and machine learning, and{" "}
                  <strong className="font-semibold text-[var(--ink)]">Linux, Bash, Docker</strong>{" "}
                  and <strong className="font-semibold text-[var(--ink)]">PostgreSQL</strong>{" "}
                  holding it all together.
                </p>
                <p>
                  Alongside that I trained in branding, copywriting and digital marketing through
                  the <strong className="font-semibold text-[var(--ink)]">Goheza program</strong> at
                  the National Innovation Hub. That combination shows up in how I build.{" "}
                  <strong className="font-semibold text-[var(--ink)]">Chicken City</strong>, a
                  multi-vendor marketplace connecting poultry farmers to buyers, feed and machinery
                  sellers, and vets, was designed, built and shipped by me alone — architecture,
                  interface and brand included. Same instinct behind{" "}
                  <strong className="font-semibold text-[var(--ink)]">FindMyHome</strong>, now
                  serving real listings at findmyhomeuganda.com.
                </p>
                <p>
                  Lately most of my work is{" "}
                  <strong className="font-semibold text-[var(--ink)]">AI infrastructure</strong>:
                  local model gateways, agent tooling, prompt-driven IDEs and prediction systems.
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="flex items-center gap-4 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 backdrop-blur-md">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1ed760] text-lg font-bold text-black">
                  ♪
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
                    Now playing
                  </p>
                  <p className="text-sm font-semibold text-[var(--ink)]">NgodingTime</p>
                </div>
                <a
                  href="https://open.spotify.com/playlist/37i9dQZF1DX51mk9KQ1RbP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-full border border-[var(--line-strong)] px-3 py-1.5 text-[11px] font-semibold text-[var(--ink-muted)] transition-colors hover:border-[#1ed760] hover:text-[#1ed760]"
                >
                  Listen
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        {/* timeline */}
        <div className="mt-16 grid gap-10 md:mt-20 md:grid-cols-2 md:gap-14">
          {[
            { label: "Education", items: EDUCATION, dot: "bg-[var(--glow-accent)]" },
            { label: "Experience", items: EXPERIENCE, dot: "bg-[var(--glow-violet)]" },
          ].map((column) => (
            <Reveal key={column.label}>
              <p className="eyebrow mb-5 flex items-center gap-3">
                <span className="h-px w-6 bg-[var(--line-strong)]" />
                {column.label}
              </p>
              <div className="relative border-l border-[var(--line-strong)] pl-6">
                {column.items.map((item) => (
                  <div key={item.id} className="relative pb-8 last:pb-0">
                    <span
                      className={`absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-[var(--space)] ${column.dot}`}
                    />
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                      {item.date}
                    </p>
                    <p className="mt-1.5 font-semibold text-[var(--ink)]">{item.title}</p>
                    <p className="text-sm text-[var(--ink-softer)]">{item.org}</p>
                    {item.focus && (
                      <p className="mt-1 text-[13px] leading-relaxed text-[var(--ink-faint)]">
                        {item.focus}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
