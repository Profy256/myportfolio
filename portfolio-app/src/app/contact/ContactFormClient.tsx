"use client";

import { useState, type FormEvent } from "react";
import { createBrowserSupabaseClient as createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/Primitives";

export type ContactState = { ok: boolean; message: string };

const INITIAL_STATE: ContactState = { ok: false, message: "" };

export function ContactFormClient() {
  const [state, setState] = useState<ContactState>(INITIAL_STATE);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setState({ ok: false, message: "All fields are required." });
      setPending(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState({ ok: false, message: "Enter a valid email address." });
      setPending(false);
      return;
    }
    if (name.length > 80) {
      setState({ ok: false, message: "Name is too long." });
      setPending(false);
      return;
    }
    if (message.length > 3000) {
      setState({ ok: false, message: "Message is too long." });
      setPending(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.from("contact_messages").insert({
        name: name.slice(0, 80),
        email: email.slice(0, 254),
        message: message.slice(0, 3000),
      });
      if (error) {
        setState({ ok: false, message: "Couldn't send your message right now. Try again." });
      } else {
        setState({
          ok: true,
          message: "Thanks — your message was sent. I'll reply within 1–2 working days.",
        });
      }
    } catch {
      setState({ ok: false, message: "Something went wrong. Try again in a moment." });
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-xs font-medium text-[var(--ink-softer)] uppercase tracking-wider mb-1">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            className="w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--ink)] placeholder-[var(--ink-faint)] px-3 py-2 text-sm focus:border-[var(--glow-accent)] focus:ring-2 focus:ring-[var(--glow-accent)]/30 outline-none transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-xs font-medium text-[var(--ink-softer)] uppercase tracking-wider mb-1">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--ink)] placeholder-[var(--ink-faint)] px-3 py-2 text-sm focus:border-[var(--glow-accent)] focus:ring-2 focus:ring-[var(--glow-accent)]/30 outline-none transition-colors"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs font-medium text-[var(--ink-softer)] uppercase tracking-wider mb-1">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--ink)] placeholder-[var(--ink-faint)] px-3 py-2 text-sm focus:border-[var(--glow-accent)] focus:ring-2 focus:ring-[var(--glow-accent)]/30 outline-none transition-colors"
          placeholder="Your message"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-[var(--ink-faint)]">
          Replies within 1–2 working days.
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" type="button" onClick={() => {}}>
            Clear
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Sending…" : "Send message"}
          </Button>
        </div>
      </div>

      {state.message && (
        <p
          className={
            [
              "text-sm rounded-lg px-3 py-2 transition-colors",
              state.ok
                ? "text-emerald-400 bg-emerald-400/10"
                : "text-rose-400 bg-rose-400/10",
            ].join(" ")
          }
          role="status"
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
