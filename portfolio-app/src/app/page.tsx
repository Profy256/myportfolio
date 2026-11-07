import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { AppHeader } from "@/components/layout/AppHeader";
import { HeroSection } from "@/components/hero/HeroSection";
import { AboutSection } from "@/components/about/AboutSection";
import { PortfolioSection } from "@/components/portfolio/PortfolioSection";
import { Reveal } from "@/components/ui/Motion";
import { ContactActions } from "@/components/contact/ContactActions";

export default function HomePage() {
  return (
    <>
      <AuroraBackground />
      <AppHeader />

      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <PortfolioSection />

        <section id="contact" className="relative scroll-mt-24 px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="panel relative overflow-hidden px-6 py-16 text-center md:px-16 md:py-24">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl"
                  style={{
                    background: "radial-gradient(circle, rgba(214,255,63,0.22), transparent 70%)",
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full blur-3xl"
                  style={{
                    background: "radial-gradient(circle, rgba(167,139,250,0.24), transparent 70%)",
                  }}
                />

                <p className="eyebrow mb-6 flex items-center justify-center gap-3">
                  <span className="h-px w-8 bg-[var(--glow-accent)]/70" />
                  03 — Contact
                </p>
                <h2 className="display-lg mx-auto max-w-3xl">
                  Let&apos;s build something{" "}
                  <span className="serif-accent">worth shipping</span>.
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-[var(--ink-softer)]">
                  Open to remote software engineering roles, contract work and collaborations.
                  I reply to every message.
                </p>

                <ContactActions />
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[var(--line)] px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 text-[13px] text-[var(--ink-faint)] sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--btn-bg)] font-display text-[11px] font-extrabold text-[var(--btn-fg)]">
              KP
            </span>
            <span>© 2026 Kafeero Proferious</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
            Built in Kampala, Uganda
          </span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Profy256"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--ink)]"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/kafeero-proferious-31785b3a7"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--ink)]"
            >
              LinkedIn
            </a>
            <a
              href="mailto:profy256@gmail.com"
              className="transition-colors hover:text-[var(--ink)]"
            >
              Email
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
