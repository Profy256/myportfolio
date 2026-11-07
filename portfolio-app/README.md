# Portfolio App

A modern, interactive full-stack developer portfolio built with the Next.js App Router, TypeScript, Tailwind CSS and Framer Motion-ready design system.

## Commands

```bash
npm run dev     # start the dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # lint
```

## Features

- Dark glassmorphic UI on a deep space background (`#0b0d17`) with animated particle canvas and neon gradient accents.
- Preloader with animated percentage counter (`0%` → `100%`) before content reveals.
- Hero with rotating typewriter role, primary CTAs and an interactive 3D hanging-ID badge (React Three Fiber + drei).
- About with neon-bordered profile card, bio, education/experience timelines and animated metric counters plus a Spotify widget.
- Portfolio with tabbed filtering (Projects / Certificates / Achievements / Tech Stack), project cards with preview + details modal, and a tech stack grid.
- Contact page with a direct message form and a live interactive comment wall (Supabase realtime).

## Supabase setup

The app uses Supabase for real-time visitor comments and contact message storage.

1. Create a project at <https://supabase.com/dashboard>.
2. Copy the project URL and anon key into `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

3. Run the following SQL (from `supabase/migrations` if present, otherwise manually) to create the tables:

```sql
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  avatar text check (avatar is null or char_length(avatar) <= 1024),
  message text not null check (char_length(message) between 1 and 1200),
  inserted_at timestamptz not null default now()
);

create index if not exists comments_inserted_at_idx on public.comments (inserted_at desc);
alter table public.comments enable row level security;
create policy "comments_select_all" on public.comments for select using (true);
create policy "comments_insert_anyone" on public.comments for insert with check (true);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  email text not null check (char_length(email) <= 254),
  message text not null check (char_length(message) between 1 and 3000),
  created_at timestamptz not null default now()
);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
alter table public.contact_messages enable row level security;
create policy "contact_insert_anyone" on public.contact_messages for insert with check (true);
```

4. Enable realtime for the comments table in the Supabase dashboard (Database → Publications → `supabase_realtime` → add `public.comments`) or via SQL:

```sql
alter publication supabase_realtime add table public.comments;
```

5. Restart the dev server after changing `.env.local`.

> Note: `contact_messages` has insert-only RLS (no read policy for anon), so visitors cannot read submissions. Admins can query them from the Supabase dashboard.

## Structure

```
src/app/            App Router pages (home, contact) and server actions
src/app/actions/    Server actions (comments, contact)
src/components/
  about/            About section
  contact/          Live comment wall
  hero/             Hero + 3D ID badge
  layout/          Floating header
  portfolio/        Portfolio section
  providers/        Theme + preloader context
  ui/               Particles canvas, glass primitives
src/lib/            Supabase clients + portfolio data
public/             Static assets (headshot, og image, CV)
```
