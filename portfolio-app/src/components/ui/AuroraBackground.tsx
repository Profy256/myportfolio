"use client";

/**
 * Ambient scene: slow aurora blooms, a fading technical grid, film grain and a
 * vignette. Purely decorative, never captures pointer events.
 */
export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 grid-veil opacity-70" />

      <div
        className="aurora-blob"
        style={{
          width: "46vw",
          height: "46vw",
          minWidth: 380,
          minHeight: 380,
          top: "-14%",
          right: "-6%",
          background: "radial-gradient(circle at 50% 50%, rgba(167,139,250,0.32), transparent 68%)",
          animationDelay: "-4s",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          width: "42vw",
          height: "42vw",
          minWidth: 340,
          minHeight: 340,
          top: "32%",
          left: "-12%",
          background: "radial-gradient(circle at 50% 50%, rgba(79,140,255,0.26), transparent 68%)",
          animationDelay: "-11s",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          width: "34vw",
          height: "34vw",
          minWidth: 260,
          minHeight: 260,
          bottom: "-10%",
          right: "8%",
          background: "radial-gradient(circle at 50% 50%, rgba(214,255,63,0.14), transparent 70%)",
          animationDelay: "-18s",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% 0%, transparent 20%, var(--space) 92%)",
          opacity: 0.72,
        }}
      />
      <div className="absolute inset-0 grain" />
    </div>
  );
}
