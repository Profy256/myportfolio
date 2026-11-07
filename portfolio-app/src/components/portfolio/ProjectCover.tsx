"use client";

import { type Project } from "@/lib/data";

const TECH_SLUG_MAP: Record<string, string> = {
  "Go": "go",
  "Next.js": "nextdotjs",
  "Nextjs": "nextdotjs",
  "TypeScript": "typescript",
  "PostgreSQL": "postgresql",
  "Tailwind CSS": "tailwindcss",
  "tailwindcss": "tailwindcss",
  "Python": "python",
  "Prisma": "prisma",
  "JavaScript": "javascript",
  "Docker": "docker",
  "Docker Compose": "docker",
  "React Native": "react",
  "Bash": "gnubash",
  "Vite SPA": "vite",
  "Shell": "gnubash",
  "HTML": "html5",
  "CSS": "tailwindcss",
  "JSON-LD": "html5",
  "git": "githubactions",
  "GitHub Actions": "githubactions",
  "Gemini": "googlegemini",
  "Express": "express",
  "Node.js": "nodedotjs",
  "Supabase": "supabase",
  "Vercel": "vercel",
  "Linux": "linux",
  "Cloudflare R2": "cloudflare",
};

const SLUG_COLORS: Record<string, string> = {
  "go": "#00ADD8",
  "nextdotjs": "#000000",
  "typescript": "#3178C6",
  "postgresql": "#4169E1",
  "tailwindcss": "#06B6D4",
  "python": "#3776AB",
  "prisma": "#2D3748",
  "javascript": "#F7DF1E",
  "docker": "#2496ED",
  "react": "#61DAFB",
  "gnubash": "#4EAA25",
  "vite": "#9135FF",
  "githubactions": "#2088FF",
  "googlegemini": "#8E75B2",
  "express": "#0A0A0A",
  "nodedotjs": "#5FA04E",
  "supabase": "#3FCF8E",
  "vercel": "#000000",
  "html5": "#E34F26",
  "css": "#06B6D4",
};

function resolveSlug(techName: string): string {
  const mapped = TECH_SLUG_MAP[techName];
  if (mapped) return mapped;
  // fallback: lowercase, replace non-alphanumerics with hyphens, trim
  return techName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getProjectSlugs(project: Project): string[] {
  const seen = new Set<string>();
  for (const tech of project.tech) {
    const slug = resolveSlug(tech);
    seen.add(slug);
  }
  // Also include tags as potential tech hints
  for (const tag of project.tags) {
    // try matching tag to known tech
    const slug = resolveSlug(tag);
    seen.add(slug);
  }
  return Array.from(seen);
}

function slugColor(slug: string): string | null {
  return SLUG_COLORS[slug] || null;
}

function gradientFromSlugs(slugs: string[]): string {
  if (slugs.length === 0) {
    return "linear-gradient(135deg, #0a0b10 0%, #1a1a2e 100%)";
  }
  // Use the first 3 unique slugs for a deterministic but varied gradient
  const unique = [...new Set(slugs)].slice(0, 3);
  if (unique.length === 1) {
    const c = slugColor(unique[0]);
    if (c) return `linear-gradient(135deg, ${c} 0%, #0a0b10 100%)`;
    return "linear-gradient(135deg, #1a1a2e 0%, #0a0b10 100%)";
  }
  if (unique.length === 2) {
    const c1 = slugColor(unique[0]);
    const c2 = slugColor(unique[1]);
    if (c1 && c2) return `linear-gradient(135deg, ${c1} 0%, ${c2} 50%, #0a0b10 100%)`;
    // fall back to hues
    const h1 = unique[0].charCodeAt(0) % 360;
    const h2 = unique[1].charCodeAt(0) % 360;
    return `linear-gradient(135deg, hsl(${h1}, 70% 10%), hsl(${h2}, 60% 15%) 50%, #0a0b10 100%)`;
  }
  // 3+ slugs
  const c1 = slugColor(unique[0]);
  const c2 = slugColor(unique[1]);
  const c3 = slugColor(unique[2]);
  if (c1 && c2 && c3) return `linear-gradient(135deg, ${c1} 0%, ${c2} 33%, ${c3} 66%, #0a0b10 100%)`;
  const h1 = unique[0].charCodeAt(0) % 360;
  const h2 = unique[1].charCodeAt(0) % 360;
  const h3 = unique[2].charCodeAt(0) % 360;
  return `linear-gradient(135deg, hsl(${h1}, 70% 10%) 0%, hsl(${h2}, 60% 15%) 33%, hsl(${h3}, 50% 20%) 66%, #0a0b10 100%)`;
}

export function ProjectCover({ project }: { project: Project }) {
  const slugs = getProjectSlugs(project);
  const bg = gradientFromSlugs(slugs);

  if (!project.logo) {
    return null;
  }

  return (
    <div
      className="relative h-44 w-full rounded-xl overflow-hidden border border-[var(--line)] bg-[var(--space-raised)]"
      style={{ backgroundImage: bg }}
    >
      <img
        src={project.logo}
        alt={`${project.title} logo`}
        className="absolute inset-0 h-full w-full object-contain p-6"
      />
    </div>
  );
}