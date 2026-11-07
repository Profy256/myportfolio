"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { createBrowserSupabaseClient as createClient } from "@/lib/supabase-browser";
import { Button, GlassCard } from "@/components/ui/Primitives";

const MAX_COMMENTS_PER_MINUTE = 6;

interface Comment {
  id: string;
  name: string;
  avatar: string | null;
  message: string;
  inserted_at: string;
}

function avatarFallback(name: string) {
  const encoded = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encoded}&background=ff9e1b&color=1a1400&size=76&bold=true`;
}

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) {
      return new Date().toLocaleString();
    }
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return new Date().toLocaleString();
  }
}

export function CommentWallClient() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string }>({ ok: false, message: "" });
  const [pending, setPending] = useState(false);
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const lastPostedKeyRef = useRef<string>("");
  const rateLimiterRef = useRef<number[]>([]);

  const now = Date.now();
  rateLimiterRef.current = rateLimiterRef.current.filter((t) => now - t < 60_000);
  const clientCanPost = rateLimiterRef.current.length < MAX_COMMENTS_PER_MINUTE;

  useEffect(() => {
    const supabase = createClient();
    supabaseRef.current = supabase;

    let cancelled = false;

    supabase
      .from("comments")
      .select("id, name, avatar, message, inserted_at")
      .order("inserted_at", { ascending: false })
      .limit(40)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && Array.isArray(data)) {
          setComments(data as Comment[]);
        }
        setLoaded(true);
      });

    const channel = supabase
      .channel("comments-wall")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        (payload: { new: Comment }) => {
          const row = payload.new;
          setComments((prev) => {
            if (prev.some((c) => c.id === row.id)) return prev;
            return [row, ...prev].slice(0, 40);
          });
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!status.ok) return;
    if (formRef.current) formRef.current.reset();
  }, [status]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const stamp = Date.now();
    rateLimiterRef.current = rateLimiterRef.current.filter((t) => stamp - t < 60_000);
    if (rateLimiterRef.current.length >= MAX_COMMENTS_PER_MINUTE) return;
    rateLimiterRef.current.push(stamp);
    lastPostedKeyRef.current = "";

    const form = e.currentTarget;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement | null;
    const messageInput = form.elements.namedItem("message") as HTMLTextAreaElement | null;
    if (nameInput && messageInput && (!nameInput.value.trim() || !messageInput.value.trim())) {
      nameInput.focus();
      return;
    }

    setPending(true);
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const avatar = String(formData.get("avatar") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    try {
      const supabase = createClient();
      const { error, data } = await supabase
        .from("comments")
        .insert({
          name: name.slice(0, 80),
          avatar: avatar.length > 0 ? avatar.slice(0, 1024) : null,
          message: message.slice(0, 1200),
          inserted_at: new Date().toISOString(),
        })
        .select("id, name, avatar, message, inserted_at")
        .single();

      if (error) {
        setStatus({ ok: false, message: "Couldn't post your comment right now. Try again." });
        return;
      }

      setStatus({ ok: true, message: "Your comment was posted." });
      const row = (data ?? null) as Comment | null;
      if (row) {
        setComments((prev) => [row, ...prev.filter((c) => c.id !== row.id)].slice(0, 40));
      }
      if (formRef.current) formRef.current.reset();
    } catch {
      setStatus({ ok: false, message: "Something went wrong. Try again in a moment." });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-5 md:p-6">
        <h3 className="text-lg font-semibold text-[var(--ink)]">Leave a comment</h3>
        <p className="text-sm text-[var(--ink-softer)] mt-1">
          Your name, a message, and an optional avatar URL. Comments appear live for everyone.
        </p>

        <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="comment-name" className="block text-xs font-medium text-[var(--ink-softer)] uppercase tracking-wider mb-1">
                Name
              </label>
              <input
                id="comment-name"
                name="name"
                type="text"
                required
                maxLength={80}
                className="w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--ink)] placeholder-[var(--ink-faint)] px-3 py-2 text-sm focus:border-[var(--glow-accent)] focus:ring-2 focus:ring-[var(--glow-accent)]/30 outline-none transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="comment-avatar" className="block text-xs font-medium text-[var(--ink-softer)] uppercase tracking-wider mb-1">
                Avatar URL (optional)
              </label>
              <input
                id="comment-avatar"
                name="avatar"
                type="url"
                className="w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--ink)] placeholder-[var(--ink-faint)] px-3 py-2 text-sm focus:border-[var(--glow-accent)] focus:ring-2 focus:ring-[var(--glow-accent)]/30 outline-none transition-colors"
                placeholder="https:// ... or leave blank"
              />
            </div>
          </div>

          <div>
            <label htmlFor="comment-message" className="block text-xs font-medium text-[var(--ink-softer)] uppercase tracking-wider mb-1">
              Message
            </label>
            <textarea
              id="comment-message"
              name="message"
              required
              maxLength={1200}
              rows={4}
              className="w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--ink)] placeholder-[var(--ink-faint)] px-3 py-2 text-sm focus:border-[var(--glow-accent)] focus:ring-2 focus:ring-[var(--glow-accent)]/30 outline-none transition-colors resize-y"
              placeholder="Your comment..."
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-[var(--ink-faint)]">
              {clientCanPost
                ? `Up to ${MAX_COMMENTS_PER_MINUTE} comments per minute`
                : "Please slow down"}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" type="button" onClick={() => formRef.current?.reset()} disabled={pending}>
                Clear
              </Button>
              <Button type="submit" disabled={pending || !clientCanPost}>
                {pending ? "Posting…" : "Post comment"}
              </Button>
            </div>
          </div>

          {status.message && (
            <p
              className={
                [
                  "text-sm rounded-lg px-3 py-2 transition-colors",
                  status.ok
                    ? "text-emerald-400 bg-emerald-400/10"
                    : "text-rose-400 bg-rose-400/10",
                ].join(" ")
              }
              role="status"
            >
              {status.message}
            </p>
          )}
        </form>
      </GlassCard>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--ink-softer)] uppercase tracking-wider">Recent comments</h3>
        {!loaded ? (
          <p className="text-sm text-[var(--ink-faint)] italic">Loading comments…</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-[var(--ink-faint)] italic">No comments yet — be the first.</p>
        ) : (
          <ul className="space-y-2">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="flex gap-3 glass rounded-xl p-3 transition-opacity animate-fade-in"
              >
                <img
                  src={
                    comment.avatar && comment.avatar.trim().length > 0
                      ? comment.avatar
                      : avatarFallback(comment.name)
                  }
                  alt=""
                  width={40}
                  height={40}
                  className="shrink-0 rounded-full object-cover border border-[var(--glass-border)] bg-[var(--glass-bg)]"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== avatarFallback(comment.name)) {
                      target.src = avatarFallback(comment.name);
                    }
                  }}
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-sm font-semibold text-[var(--ink)] truncate">{comment.name}</p>
                  <p className="text-xs text-[var(--ink-faint)]">{formatTime(comment.inserted_at)}</p>
                  <p className="text-sm text-[var(--ink-muted)] leading-relaxed whitespace-pre-wrap break-words">
                    {comment.message}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
