import { forwardRef } from "react";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  neon?: boolean;
  glow?: boolean;
  hoverLift?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  function GlassCard({ neon, glow, hoverLift, className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={[
          "rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 backdrop-blur-xl shadow-glass transition-all duration-300",
          neon && "neon-border",
          glow && "glow-accent",
          hoverLift && "hover:-translate-y-1 hover:border-[var(--line-strong)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </div>
    );
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = "primary", size = "md", className, children, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={[
          "group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--space)]",
          variant === "primary" &&
            "btn-shine bg-[var(--btn-bg)] text-[var(--btn-fg)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_var(--btn-bg)]",
          variant === "ghost" &&
            "border border-[var(--line-strong)] bg-[var(--panel)] text-[var(--ink)] backdrop-blur-md hover:-translate-y-0.5 hover:border-[var(--glow-accent)]/60",
          variant === "outline" &&
            "border border-[var(--line)] bg-transparent text-[var(--ink)] hover:border-[var(--line-strong)] hover:bg-[var(--glass-strong)]",
          size === "sm" && "px-4 py-2 text-[13px]",
          size === "md" && "px-6 py-3 text-sm",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </button>
    );
  }
);

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "ghost";
  size?: "sm" | "md";
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  function LinkButton({ variant = "primary", size = "md", className, children, ...props }, ref) {
    return (
      <a
        ref={ref}
        className={[
          "group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--space)]",
          variant === "primary" &&
            "btn-shine bg-[var(--btn-bg)] text-[var(--btn-fg)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_var(--btn-bg)]",
          variant === "ghost" &&
            "border border-[var(--line-strong)] bg-[var(--panel)] text-[var(--ink)] backdrop-blur-md hover:-translate-y-0.5 hover:border-[var(--glow-accent)]/60",
          size === "sm" && "px-4 py-2 text-[13px]",
          size === "md" && "px-6 py-3 text-sm",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </a>
    );
  }
);

export function SectionHead({
  eyebrow,
  title,
  note,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  note?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={["mb-12 md:mb-16", align === "center" ? "text-center" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      {eyebrow && (
        <p
          className={[
            "eyebrow mb-5 flex items-center gap-3",
            align === "center" ? "justify-center" : "",
          ].join(" ")}
        >
          <span className="h-px w-8 bg-[var(--glow-accent)]/70" />
          {eyebrow}
        </p>
      )}
      <h2 className="display-lg text-[var(--ink)]">{title}</h2>
      {note && (
        <p
          className={[
            "mt-5 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-softer)]",
            align === "center" ? "mx-auto" : "",
          ].join(" ")}
        >
          {note}
        </p>
      )}
    </div>
  );
}

export function Badge({
  children,
  variant = "accent",
  className,
}: {
  children: React.ReactNode;
  variant?: "accent" | "ghost" | "live";
  className?: string;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em]",
        variant === "accent" &&
          "bg-[var(--glow-accent)]/12 text-[var(--glow-accent)] ring-1 ring-inset ring-[var(--glow-accent)]/25",
        variant === "ghost" &&
          "bg-[var(--glass-strong)] text-[var(--ink-softer)] ring-1 ring-inset ring-[var(--line)]",
        variant === "live" && "bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/25",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {variant === "live" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />}
      {children}
    </span>
  );
}

export function TechBadge({
  name,
  active = false,
  className,
}: {
  name: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 font-mono text-[11px] tracking-[0.04em] transition-all duration-300",
        active
          ? "bg-[var(--btn-bg)] text-[var(--btn-fg)]"
          : "border border-[var(--line)] bg-[var(--glass-strong)] text-[var(--ink-muted)] hover:border-[var(--glow-accent)]/45 hover:text-[var(--glow-accent)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {name}
    </span>
  );
}
