export interface Project {
  slug: string;
  title: string;
  tag: string;
  live: boolean;
  preview: string;
  description: string;
  details: { label: string; value: string }[];
  tech: string[];
  tags: string[];
  links: { label: string; href: string; muted?: boolean }[];
  meta?: string;
  logo?: string | null;
}

export interface Certificate {
  id: string;
  title: string;
  org: string;
  date?: string;
  note?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

export interface TechCategory {
  id: string;
  label: string;
  items: string[];
}
