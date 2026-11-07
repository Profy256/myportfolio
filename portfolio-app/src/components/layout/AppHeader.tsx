"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useThemeContext } from "@/components/providers/ThemeAndPreloaderProvider";

const NAV_LINKS = [
  { href: "#home", label: "Home", index: "00" },
  { href: "#about", label: "About", index: "01" },
  { href: "#portfolio", label: "Work", index: "02" },
  { href: "#contact", label: "Contact", index: "03" },
];

export function AppHeader() {
  const { theme, toggleTheme } = useThemeContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? (doc.scrollTop / max) * 100 : 0);
      setScrolled(doc.scrollTop > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el instanceof HTMLElement);

    if (!("IntersectionObserver" in window) || !sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-[var(--glow-accent)] via-[#9ef7c4] to-[var(--glow-blue)] transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 md:px-6 md:pt-4">
        <div className="mx-auto max-w-6xl">
          <div
            className={[
              "flex items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 transition-all duration-500 md:rounded-full md:px-4",
              scrolled
                ? "border-[var(--line-strong)] bg-[var(--panel)] shadow-glass backdrop-blur-2xl"
                : "border-[var(--line)] bg-transparent backdrop-blur-sm",
            ].join(" ")}
          >
            <Link
              href="#home"
              className="group flex items-center gap-3"
              onClick={() => setMobileOpen(false)}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--btn-bg)] font-display text-[13px] font-extrabold tracking-tight text-[var(--btn-fg)] transition-transform duration-300 group-hover:-rotate-6">
                KP
              </span>
              <span className="hidden leading-tight sm:block">
                <span className="block text-[13px] font-semibold text-[var(--ink)]">
                  Kafeero Proferious
                </span>
                <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
                  Software engineer
                </span>
              </span>
            </Link>

            <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
              {NAV_LINKS.map((link) => {
                const isActive = activeId === link.href.slice(1);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={[
                      "relative rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-300",
                      isActive
                        ? "text-[var(--ink)]"
                        : "text-[var(--ink-softer)] hover:text-[var(--ink)]",
                    ].join(" ")}
                  >
                    {isActive && (
                      <span className="absolute inset-0 -z-10 rounded-full bg-[var(--glass-strong)] ring-1 ring-inset ring-[var(--line-strong)]" />
                    )}
                    <span className="mr-1.5 font-mono text-[9px] text-[var(--glow-accent)]">
                      {link.index}
                    </span>
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Switch theme"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink-muted)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
              >
                {theme === "light" ? (
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <circle cx="10" cy="10" r="3.6" />
                    <path d="M10 1.6v2M10 16.4v2M18.4 10h-2M3.6 10h-2M15.9 4.1l-1.4 1.4M5.5 14.5l-1.4 1.4M15.9 15.9l-1.4-1.4M5.5 5.5L4.1 4.1" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                    <path d="M17 11.7A7.4 7.4 0 0 1 8.3 3a7.4 7.4 0 1 0 8.7 8.7Z" />
                  </svg>
                )}
              </button>

              <Link
                href="/assets/Kafeero-Proferious-CV.pdf"
                download
                className="hidden items-center gap-2 rounded-full bg-[var(--btn-bg)] px-4 py-2 text-[13px] font-semibold text-[var(--btn-fg)] transition-transform duration-300 hover:-translate-y-0.5 sm:inline-flex"
              >
                Download CV
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink)] md:hidden"
              >
                {mobileOpen ? (
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d="M3 4.5L15 13.5M15 4.5L3 13.5" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d="M2 5h14M2 9h14M2 13h14" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* mobile sheet */}
          <div
            className={[
              "mt-2 overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--panel)] backdrop-blur-2xl transition-all duration-500 md:hidden",
              mobileOpen ? "max-h-80 opacity-100" : "pointer-events-none max-h-0 border-transparent opacity-0",
            ].join(" ")}
          >
            <nav aria-label="Mobile" className="flex flex-col p-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-[var(--ink-muted)] transition-colors hover:bg-[var(--glass-strong)] hover:text-[var(--ink)]"
                >
                  {link.label}
                  <span className="font-mono text-[10px] text-[var(--glow-accent)]">{link.index}</span>
                </Link>
              ))}
              <Link
                href="/assets/Kafeero-Proferious-CV.pdf"
                download
                className="mt-1 flex items-center justify-center rounded-xl bg-[var(--btn-bg)] px-3 py-3 text-sm font-semibold text-[var(--btn-fg)]"
              >
                Download CV
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
