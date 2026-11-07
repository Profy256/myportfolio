"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Globe, Mail, MessageCircle, Phone } from "lucide-react";
import { LinkButton } from "@/components/ui/Primitives";

const EMAIL = "profy256@gmail.com";
const PHONE_DISPLAY = "+256 740 686 937";
const PHONE_HREF = "tel:+256740686937";
const WHATSAPP_HREF = "https://wa.me/256740686937";
const SEFADEV_HREF = "https://sefadev.com/Profy256";
const SEFADEV_DISPLAY = "sefadev.com/Profy256";

const TILE =
  "group flex w-full flex-col items-center gap-1.5 rounded-2xl border border-[var(--line)] bg-[var(--panel)] px-4 py-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--glow-accent)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--space)]";

const LABEL = "font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--ink-faint)]";
const VALUE =
  "text-[13px] font-semibold text-[var(--ink)] transition-colors group-hover:text-[var(--glow-accent)]";

export function ContactActions() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copyEmail = useCallback(async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(EMAIL);
      } else {
        const field = document.createElement("textarea");
        field.value = EMAIL;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        document.execCommand("copy");
        document.body.removeChild(field);
      }
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }, []);

  return (
    <>
      <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={copyEmail}
          title={`Copy ${EMAIL}`}
          aria-label={`Copy email address ${EMAIL}`}
          className={TILE}
        >
          <span className="mb-1 grid h-4 w-4 place-items-center text-[var(--glow-accent)]">
            {copied ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Mail className="h-4 w-4" aria-hidden="true" />
            )}
          </span>
          <span className={`${LABEL} ${copied ? "text-[var(--glow-accent)]" : ""}`} aria-live="polite">
            {copied ? "Copied" : "Email · tap to copy"}
          </span>
          <span className={VALUE}>{EMAIL}</span>
        </button>

        <a href={PHONE_HREF} className={TILE} aria-label={`Call ${PHONE_DISPLAY}`}>
          <span className="mb-1 grid h-4 w-4 place-items-center text-[var(--glow-accent)]">
            <Phone className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className={LABEL}>Contact</span>
          <span className={VALUE}>{PHONE_DISPLAY}</span>
        </a>

        <a
          href={SEFADEV_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className={TILE}
          aria-label="Open Sefadev profile"
        >
          <span className="mb-1 grid h-4 w-4 place-items-center text-[var(--glow-accent)]">
            <Globe className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className={LABEL}>Sefadev</span>
          <span className={VALUE}>{SEFADEV_DISPLAY}</span>
        </a>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-2 rounded-full border border-[var(--glow-accent)]/45 bg-[var(--glow-accent)]/10 px-6 py-3 text-sm font-semibold text-[var(--ink)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--glow-accent)]/70 hover:bg-[var(--glow-accent)]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--space)]"
        >
          <MessageCircle className="h-4 w-4 text-[var(--glow-accent)]" aria-hidden="true" />
          Chat on WhatsApp
        </a>
        <LinkButton href="/assets/Kafeero-Proferious-CV.pdf" variant="ghost" size="md" download>
          Download CV
        </LinkButton>
      </div>
    </>
  );
}
