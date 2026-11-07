"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SectionHead } from "@/components/ui/Primitives";
import { Badge, GlassCard, TechBadge } from "@/components/ui/Primitives";
import type { Project, Certificate, Achievement, TechCategory } from "@/lib/data";
import { ProjectCover } from "@/components/portfolio/ProjectCover";

interface TabItem {
  id: "projects" | "certificates" | "achievements" | "stack";
  label: string;
}

const TABS: TabItem[] = [
  { id: "projects", label: "Projects" },
  { id: "certificates", label: "Certificates" },
  { id: "achievements", label: "Achievements" },
  { id: "stack", label: "Tech Stack" },
];

const FILTERS = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "ai", label: "AI & Data" },
  { value: "platform", label: "Platforms" },
  { value: "devtool", label: "Dev Tools" },
  { value: "oss", label: "Open Source" },
];

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
}

function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, visible };
}

function ProjectCard({ project, onOpen }: ProjectCardProps) {

  return (
    <div
      key={project.slug}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(project)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(project);
        }
      }}
      className="spot-card group flex cursor-pointer flex-col gap-4 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-glass"
    >
      {project.logo ? (
        <div className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--space-raised)]">
          <ProjectCover project={project} />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--space)]/80 via-[var(--space)]/10 to-transparent pointer-events-none" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge variant="accent">{project.tag}</Badge>
            {project.live && <Badge variant="live">Live</Badge>}
          </div>
        </div>
      ) : (
        <div className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-xl px-4">
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge variant="accent">{project.tag}</Badge>
            {project.live && <Badge variant="live">Live</Badge>}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h3 className="font-display text-[15px] font-semibold tracking-tight text-[var(--ink)] transition-colors group-hover:text-[var(--glow-accent)] md:text-base">
          {project.title}
        </h3>
        <p className="text-sm text-[var(--ink-softer)] leading-relaxed line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 text-xs text-[var(--ink-faint)]">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-md border border-[var(--line)] bg-[var(--glass-strong)] px-2 py-0.5 font-mono text-[10px] tracking-[0.04em]"
            >
              {t}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="text-[var(--ink-faint)]">
              +{project.tech.length - 4}
            </span>
          )}
        </div>
        {project.meta && <p className="text-xs text-[var(--ink-faint)]">{project.meta}</p>}
      </div>

      {project.links.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-2 border-t border-[var(--line)] pt-3">
          {project.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "inline-flex items-center gap-1.5 text-sm font-medium rounded-md px-3 py-1.5 transition-colors",
                link.muted
                  ? "text-[var(--ink-softer)] hover:text-[var(--ink)] hover:bg-[var(--glass-strong)]"
                  : "text-[var(--glow-accent)] hover:bg-[var(--glow-accent)]/10",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {link.label}
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 10l6-6M8 10h4v4" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--space)]/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <GlassCard
        neon
        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {project.logo && (
            <div className="relative h-56 w-full rounded-xl overflow-hidden border border-[var(--glass-border)] md:h-72">
              <ProjectCover project={project} />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--space)]/80 via-transparent to-transparent" />
            </div>
          )}
          <button
            type="button"
            className="absolute top-3 right-3 rounded-full bg-[var(--space)]/70 backdrop-blur-sm px-2 py-1 text-sm text-[var(--ink)] hover:bg-[var(--glass-strong)] transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="accent">{project.tag}</Badge>
            {project.live && <Badge variant="live">Live</Badge>}
          </div>
          <h3 className="font-display text-2xl font-bold text-[var(--ink)]">{project.title}</h3>
          <p className="text-sm text-[var(--ink-softer)] leading-relaxed">{project.description}</p>

          {project.details && (
            <div className="space-y-2 text-sm text-[var(--ink-muted)]">
              {project.details.map((d) => (
                <div key={d.label} className="flex gap-3">
                  <span className="shrink-0 min-w-[84px] font-semibold text-[var(--ink)]">
                    {d.label}
                  </span>
                  <span>{d.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <TechBadge key={t} name={t} />
            ))}
          </div>

          {project.links.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--glass-border)]">
              {project.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={[
                    "inline-flex items-center gap-1.5 text-sm font-medium rounded-md px-3 py-1.5 transition-colors",
                    link.muted
                      ? "text-[var(--ink-softer)] hover:text-[var(--ink)] hover:bg-[var(--glass-strong)]"
                      : "text-[var(--glow-accent)] hover:bg-[var(--glow-accent)]/10",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={onClose}
                >
                  {link.label}
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M4 10l6-6M8 10h4v4" />
                  </svg>
                </Link>
              ))}
            </div>
          )}

          {project.meta && <p className="text-xs text-[var(--ink-faint)]">{project.meta}</p>}
        </div>
      </GlassCard>
    </div>
  );
}

function CertificationsPanel({ certificates }: { certificates: Certificate[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {certificates.map((cert) => (
        <GlassCard key={cert.id} hoverLift className="spot-card flex flex-col gap-2">
          <p className="font-semibold text-[var(--ink)]">{cert.title}</p>
          <p className="text-sm text-[var(--ink-softer)]">{cert.org}</p>
          {cert.date && <p className="text-xs text-[var(--ink-faint)]">{cert.date}</p>}
          {cert.note && <p className="text-xs text-[var(--ink-faint)] italic mt-1">{cert.note}</p>}
        </GlassCard>
      ))}
    </div>
  );
}

function AchievementsPanel({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {achievements.map((item, i) => (
        <GlassCard key={item.id} hoverLift className="flex items-start gap-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--glow-accent)]/12 font-mono text-xs font-semibold text-[var(--glow-accent)] ring-1 ring-inset ring-[var(--glow-accent)]/25">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <p className="font-semibold text-[var(--ink)]">{item.title}</p>
            <p className="text-sm text-[var(--ink-softer)] mt-1">{item.description}</p>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

function TechStackPanel({ stack }: { stack: TechCategory[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stack.map((cat) => (
        <div key={cat.id} className="space-y-3">
          <h3 className="text-sm font-semibold text-[var(--glow-accent)] uppercase tracking-wider">
            {cat.label}
          </h3>
          <div className="flex flex-wrap gap-2">
            {cat.items.map((item) => (
              <TechBadge key={item} name={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function PortfolioSection() {
  const [activeTab, setActiveTab] = useState<"projects" | "certificates" | "achievements" | "stack">(
    "projects"
  );
  const [filter, setFilter] = useState("all");
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const { ref: reviewRef, visible: reviewVisible } = useScrollReveal<HTMLDivElement>();

  const filteredProjects = (() => {
    const list = PROJECTS;
    if (filter === "all") return list;
    const set = new Set(filter.split(" "));
    return list.filter((p) => p.tags.some((t) => set.has(t)));
  })();

  return (
    <section id="portfolio" className="relative scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          eyebrow="02 — Work"
          title={
            <>
              Selected <span className="serif-accent">work</span> &amp; proof.
            </>
          }
          note="Hand-built products, the certifications behind them, and the tools I ship with."
        />

        <div className="mb-8 inline-flex flex-wrap gap-1 rounded-full border border-[var(--line)] bg-[var(--panel)] p-1 backdrop-blur-md">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={[
                "rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-300",
                activeTab === tab.id
                  ? "bg-[var(--btn-bg)] text-[var(--btn-fg)]"
                  : "text-[var(--ink-softer)] hover:bg-[var(--glass-strong)] hover:text-[var(--ink)]",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-pressed={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[220px]">
          {activeTab === "projects" && (
            <div
              ref={reviewRef}
              className={[
                "transition-opacity duration-300",
                reviewVisible ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              <div className="mb-6 flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFilter(f.value)}
                    className={[
                      "rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors",
                      filter === f.value
                        ? "bg-[var(--btn-bg)] text-[var(--btn-fg)]"
                        : "border border-[var(--line)] bg-[var(--panel)] text-[var(--ink-softer)] hover:border-[var(--glow-accent)]/45 hover:text-[var(--glow-accent)]",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {filteredProjects.length === 0 ? (
                <p className="text-[var(--ink-faint)] italic">No projects in that category.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.slug} project={project} onOpen={setOpenProject} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "certificates" && (
            <div
              className={[
                "transition-opacity duration-300",
                reviewVisible ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              <CertificationsPanel certificates={CERTIFICATES} />
            </div>
          )}

          {activeTab === "achievements" && (
            <div
              className={[
                "transition-opacity duration-300",
                reviewVisible ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              <AchievementsPanel achievements={ACHIEVEMENTS} />
            </div>
          )}

          {activeTab === "stack" && (
            <div
              className={[
                "transition-opacity duration-300",
                reviewVisible ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              <TechStackPanel stack={TECH_STACK} />
            </div>
          )}
        </div>
      </div>

      {openProject && <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />}
    </section>
  );
}

const PROJECTS: Project[] = [
  {
    slug: "findmyhome",
    title: "FindMyHome Uganda",
    tag: "Marketplace · Real Estate",
    live: true,
    preview: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
    description:
      "Uganda's trusted digital real-estate marketplace — verified sellers list, serious buyers discover homes, land, rentals, Airbnbs, lodges and apartments in one place.",
    details: [
      { label: "System", value: "Five repositories — Go API, Next.js web client, admin dashboard, sub-admin console and a React Native mobile app." },
      { label: "My role", value: "Architecture, backend, front end, mobile and brand. Built end to end." },
    ],
    tech: ["Go", "Next.js", "TypeScript", "PostgreSQL", "Docker", "Tailwind", "React Native"],
    tags: ["live", "platform"],
    links: [
      { label: "findmyhomeuganda.com", href: "https://www.findmyhomeuganda.com" },
      { label: "web app", href: "https://findmyhome-delta.vercel.app", muted: true },
    ],
    meta: "Private source · 5 repositories",
  },
  {
    slug: "campus-library",
    title: "Campus Library",
    tag: "Marketplace · EdTech",
    live: true,
    preview: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=400&fit=crop",
    description:
      "An online academic library where students pay per book and download instantly — Medical, Engineering, Business, Law, Accounting & Finance, Programming and more.",
    details: [
      {
        label: "System",
        value:
          "TypeScript monorepo — an SSR Next.js catalog, separately-originated admin panel, shared Express REST API and a Prisma schema package.",
      },
      {
        label: "Engineering",
        value:
          "Postgres full-text search, S3-compatible storage for books, expiring signed download links issued per order.",
      },
      {
        label: "Payments",
        value:
          "MarzPay mobile-money integration, with a mock mode for testing without live credentials.",
      },
    ],
    tech: ["TypeScript", "Next.js", "Express", "Prisma", "PostgreSQL", "Cloudflare R2", "Docker Compose"],
    tags: ["live", "platform"],
    links: [
      { label: "campuslibrary.xyz", href: "https://www.campuslibrary.xyz" },
      { label: "admin panel", href: "https://admin.campuslibrary.xyz", muted: true },
    ],
    meta: "Private source · monorepo",
  },
  {
    slug: "kp-whatsapp",
    title: "KP-WhatsApp",
    tag: "AI · Multi-tenant SaaS",
    live: true,
    preview: "https://images.unsplash.com/photo-1551288049-bebda4e3e3c3?w=600&h=400&fit=crop",
    description:
      "A multi-tenant WhatsApp automation platform. Businesses connect their WhatsApp Business number by QR code and let AI handle customer conversations 24/7.",
    details: [
      {
        label: "Platforms",
        value: "Per-tenant AI config, packages and referrals, with 24/7 AI conversation handling.",
      },
    ],
    tech: ["TypeScript", "Next.js", "Prisma", "PostgreSQL", "Docker"],
    tags: ["live", "ai", "oss"],
    links: [
      { label: "Live app", href: "https://kp-whatsapp-frontend.vercel.app" },
      { label: "Source", href: "https://github.com/Profy256/KP-WHATSAPP", muted: true },
    ],
    meta: "Public source",
  },
  {
    slug: "palius",
    title: "Palius",
    tag: "AI · Social Automation",
    live: false,
    preview: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop",
    description:
      "A desktop AI platform that runs an entire social-media presence from one dashboard — for solo developers, startups, small marketing teams, businesses and influencers.",
    details: [
      {
        label: "Scale",
        value: "My largest active codebase — a Go service layer behind a Next.js desktop client, containerised end to end.",
      },
      {
        label: "Integrations",
        value: "Multi-provider AI routing across Gemini, OpenAI and Anthropic.",
      },
    ],
    tech: ["Go", "TypeScript", "Next.js", "Docker Compose", "Tailwind CSS"],
    tags: ["ai", "oss"],
    links: [
      { label: "Source on GitHub", href: "https://github.com/Profy256/Palius" },
    ],
    meta: "Public source",
    logo: "/logos/palius.svg",
  },
  {
    slug: "katafa",
    title: "Katafa Soccer Predictions",
    tag: "AI · Sports Analytics",
    live: false,
    preview: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=400&fit=crop",
    description:
      "An AI-powered soccer prediction platform — a Go ingestion and modelling service over PostgreSQL, scheduled prediction ticks, and a Next.js front end.",
    details: [
      {
        label: "Pipeline",
        value: "Go ingestion and modelling over PostgreSQL, scheduled prediction ticks, with its own CI pipeline.",
      },
    ],
    tech: ["Go", "PL/pgSQL", "TypeScript", "Next.js", "GitHub Actions", "Shell"],
    tags: ["ai", "oss"],
    links: [
      { label: "Source on GitHub", href: "https://github.com/Profy256/katafasoccerpredictions" },
    ],
    meta: "Public source",
    logo: "/logos/katafa.png",
  },
  {
    slug: "profy-glitch",
    title: "Profy Glitch",
    tag: "Developer Tool · AI Gateway",
    live: false,
    preview: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
    description:
      "A local AI gateway that connects multiple AI providers to your development environment — talking to each one through your own active login sessions.",
    details: [
      {
        label: "Idea",
        value: "No API keys, no per-token billing. AI providers are reached the way you'd chat with them yourself.",
      },
    ],
    tech: ["Bash", "Python", "JavaScript", "Linux"],
    tags: ["devtool", "ai", "oss"],
    links: [
      { label: "Source on GitHub", href: "https://github.com/Profy256/ProfyGlitch" },
    ],
    meta: "Public source",
    logo: "/logos/glitch.svg",
  },
  {
    slug: "drug-stock-predictor",
    title: "Drug Stock Predictor",
    tag: "AI · Healthcare",
    live: false,
    preview: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&h=400&fit=crop",
    description:
      "A full-stack application for hospital pharmacies: RBAC, an AI analytics dashboard, predictive stockout alerts and automated WhatsApp expiry notifications.",
    details: [
      {
        label: "Goal",
        value: "So wards stop running dry without warning.",
      },
    ],
    tech: ["Python", "JavaScript", "Docker", "Makefile"],
    tags: ["ai", "oss"],
    links: [
      { label: "Source on GitHub", href: "https://github.com/Profy256/Drug-stock-predictor" },
    ],
    meta: "Public source · ★ 1",
  },
  {
    slug: "profy-dev",
    title: "Profy-dev",
    tag: "Developer Tool · AI IDE",
    live: false,
    preview: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
    description:
      "A browser-based, AI-powered IDE in the spirit of lovable.dev — you write a prompt, you get a working prototype instantly.",
    details: [
      {
        label: "Approach",
        value: "Go orchestration behind a Next.js workspace, with Docker for a clean local dev experience.",
      },
    ],
    tech: ["Go", "TypeScript", "Next.js", "Docker", "Tailwind CSS"],
    tags: ["devtool", "ai", "oss"],
    links: [
      { label: "Source on GitHub", href: "https://github.com/Profy256/Profy-dev" },
    ],
    meta: "Public source",
  },
  {
    slug: "socialpulse",
    title: "SocialPulse",
    tag: "AI · Video & Campaigns",
    live: false,
    preview: "https://images.unsplash.com/photo-1551288049-bebda4e3e3c3?w=600&h=400&fit=crop",
    description:
      "An open-source AI platform helping marketing teams and creators generate strategic campaigns and high-fidelity video ads.",
    details: [
      {
        label: "Stack",
        value: "Strategy with Gemini, video with Veo, plus an admin dashboard for usage and analytics.",
      },
    ],
    tech: ["TypeScript", "Vite SPA", "Next.js", "Expo", "Gemini", "Veo"],
    tags: ["ai", "oss"],
    links: [
      { label: "Source on GitHub", href: "https://github.com/Profy256/Socialpulse" },
    ],
    meta: "Public source",
  },
  {
    slug: "chicken-city",
    title: "Chicken City",
    tag: "Marketplace · Solo Build",
    live: false,
    preview: "https://images.unsplash.com/photo-1580971491726-5e586db5d278?w=600&h=400&fit=crop",
    description:
      "A multi-vendor smart poultry platform connecting farmers to buyers, feed and machinery sellers, and vets and farm technicians.",
    details: [
      {
        label: "Role",
        value: "Designed, built and shipped end to end, solo — architecture, interface and brand included.",
      },
    ],
    tech: ["Go (Gin)", "TypeScript", "Next.js", "Docker", "Tailwind CSS"],
    tags: ["platform"],
    links: [],
    meta: "Private source",
  },
  {
    slug: "this-portfolio",
    title: "This Portfolio",
    tag: "Web · Personal Site",
    live: true,
    preview: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&h=400&fit=crop",
    description:
      "Hand-built, dependency-light, and deliberately fast — semantic HTML, a single stylesheet, a little vanilla JavaScript, structured data for search engines.",
    details: [
      {
        label: "Build",
        value: "No build step at all. Source is public.",
      },
    ],
    tech: ["HTML", "CSS", "Vanilla JS", "JSON-LD", "GitHub Pages"],
    tags: ["oss"],
    links: [
      { label: "Source on GitHub", href: "https://github.com/Profy256/Profy256.github.io" },
    ],
    meta: "Public source",
  },
];

const CERTIFICATES: Certificate[] = [
  {
    id: "goheza-cert",
    title: "Goheza Digital Marketing Training Program",
    org: "National Innovation Hub",
    date: "2026",
    note: "Branding, copywriting, digital marketing strategy.",
  },
  {
    id: "ict-club-cert",
    title: "Vice President — ICT Club",
    org: "Blessed Sacrament SS Kimanya",
    date: "2023 — 2024",
    note: "Leadership, workshops and inter-school competitions.",
  },
  {
    id: "bsc-cert",
    title: "B.Sc. Software Engineering",
    org: "Kampala International University",
    date: "in progress",
    note: "Expected completion alongside production work.",
  },
];

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    title: "Solo-built multi-vendor marketplace",
    description:
      "Chicken City designed, built and shipped end to end by one person — architecture, interface and brand.",
  },
  {
    id: "ach-2",
    title: "AI WhatsApp platform in production",
    description:
      "KP-WhatsApp running multi-tenant AI conversations for businesses with QR onboarding and referral packages.",
  },
  {
    id: "ach-3",
    title: "AI soccer prediction platform",
    description:
      "Katafa with scheduled model runs, a Go + PL/pgSQL modelling pipeline and its own CI.",
  },
];

const TECH_STACK: TechCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "HTML5",
      "CSS3",
      "Font Awesome",
    ],
  },
  {
    id: "backend",
    label: "Backend",
    items: ["Go", "Java / Spring Boot", "TypeScript", "Express", "Python", "Bash / Shell"],
  },
  {
    id: "databases",
    label: "Databases",
    items: [
      "PostgreSQL",
      "PL/pgSQL",
      "Prisma",
      "Supabase",
      "Firebase",
      "MySQL",
      "Cloudflare R2",
    ],
  },
  {
    id: "devops",
    label: "DevOps & Platform",
    items: ["Linux", "Docker", "Docker Compose", "GitHub Actions", "Make", "Vercel", "GitHub Pages"],
  },
  {
    id: "tools",
    label: "Tools",
    items: ["Git", "GitHub", "VSCode", "XAMPP", "REST APIs", "Auth & RBAC"],
  },
];
