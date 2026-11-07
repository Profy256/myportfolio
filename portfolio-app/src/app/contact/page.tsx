import type { Metadata } from "next";
import Link from "next/link";
import { ContactFormClient } from "./ContactFormClient";
import { CommentWallClient } from "@/components/contact/CommentWallClient";
import { SectionHead } from "@/components/ui/Primitives";
import { GlassCard } from "@/components/ui/Primitives";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Kafeero Proferious — software engineer in Kampala, Uganda.",
};

export default function ContactPage() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 h-14 md:h-16 bg-[var(--space)]/90 backdrop-blur-sm border-b border-[var(--glass-border)]">
        <div className="mx-auto max-w-6xl px-4 h-full flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors">
            ← Back to portfolio
          </Link>
          <Link
            href="/assets/Kafeero-Proferious-CV.pdf"
            download
            className="text-xs font-medium text-[var(--ink-softer)] hover:text-[var(--ink)] transition-colors"
          >
            Download CV
          </Link>
        </div>
      </div>

      <main className="relative scroll-mt-20 pt-20 px-4 pb-20 md:pb-28">
        <div className="mx-auto max-w-6xl">
          <SectionHead eyebrow="Contact" title="Let's build something." note="Open to remote software engineering roles, contract work and collaborations. I reply to every message." />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">
            <div className="lg:col-span-2 space-y-5">
              <GlassCard className="flex flex-col gap-4">
                <a
                  href="mailto:profy256@gmail.com"
                  className="inline-flex items-center gap-3 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 text-sm font-semibold text-[var(--ink)] hover:border-[var(--glow-accent)]/40 hover:bg-[var(--glow-accent)]/10 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <rect x="2" y="4" width="12" height="9" rx="2" />
                    <path d="M2 5.5l7 5 7-5" />
                  </svg>
                  profy256@gmail.com
                </a>

                <ul className="space-y-3 text-sm">
                  <li className="flex flex-col gap-0.5">
                    <span className="text-[var(--ink-faint)] text-[11px] uppercase tracking-wider">Phone</span>
                    <a href="tel:+256740686937" className="text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors">
                      +256 740 686 937
                    </a>
                  </li>
                  <li className="flex flex-col gap-0.5">
                    <span className="text-[var(--ink-faint)] text-[11px] uppercase tracking-wider">Location</span>
                    <span className="text-[var(--ink-muted)]">Kampala, Uganda · UTC+3</span>
                  </li>
                  <li className="flex flex-col gap-0.5">
                    <span className="text-[var(--ink-faint)] text-[11px] uppercase tracking-wider">Sefadev</span>
                    <a
                      href="https://sefadev.com/Profy256"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
                    >
                      sefadev.com/Profy256
                    </a>
                  </li>
                  <li className="flex flex-col gap-0.5">
                    <span className="text-[var(--ink-faint)] text-[11px] uppercase tracking-wider">Availability</span>
                    <span className="text-[var(--ink-muted)]">Open to remote work worldwide</span>
                  </li>
                </ul>

                <div className="flex flex-wrap gap-3 pt-1 border-t border-[var(--glass-border)]">
                  <a
                    href="https://github.com/Profy256"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] hover:border-[var(--glow-accent)]/40 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.08.55-.17.55-.38v-1.49c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.17-.89-1.17-.72-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.71 1.22 1.87.87 2.33.67.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.96 0-.87.31-1.59.82-2.14-.08-.2-.36-1.02.08-2.13 0 0 .67-.21 2.2.82a7.5 7.5 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.51.55.82 1.27.82 2.14 0 3.08-1.88 3.75-3.66 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    GitHub — Profy256
                  </a>
                  <a
                    href="https://www.linkedin.com/in/kafeero-proferious-31785b3a7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] hover:border-[var(--glow-accent)]/40 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d="M0 1.15C0 .51.53 0 1.19 0h13.62C15.47 0 16 .51 16 1.15v13.7c0 .64-.53 1.15-1.19 1.15H1.19C.53 16 0 15.49 0 14.85V1.15ZM4.75 13.4V6.2H2.4v7.2h2.35Zm-1.17-8.2c.82 0 1.33-.54 1.33-1.22C4.9 3.3 4.4 2.77 3.6 2.77c-.8 0-1.33.53-1.33 1.21 0 .68.51 1.22 1.3 1.22h.01ZM6.4 13.4h2.35V9.38c0-.22.02-.43.08-.59.17-.43.57-.88 1.24-.88.87 0 1.22.67 1.22 1.64V13.4h2.35V9.27c0-2.18-1.16-3.19-2.71-3.19-1.25 0-1.8.7-2.11 1.19h.02V6.2H6.4c.03.66 0 7.2 0 7.2Z" />
                    </svg>
                    LinkedIn — kafeero-proferious
                  </a>
                </div>
              </GlassCard>

              <GlassCard className="p-5 md:p-6">
                <h3 className="text-base font-semibold text-[var(--ink)]">Send a message</h3>
                <p className="text-sm text-[var(--ink-softer)] mt-1">
                  Tell me about the role, project, or collaboration — and I&apos;ll get back to you.
                </p>
                <div className="mt-4">
                  <ContactFormClient />
                </div>
              </GlassCard>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <h3 className="text-sm font-semibold text-[var(--ink-softer)] uppercase tracking-wider">Live comments</h3>
              <CommentWallClient />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
