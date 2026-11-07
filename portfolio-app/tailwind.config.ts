export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        space: {
          DEFAULT: "#070810",
          panel: "#0c0f18",
          raised: "#121722",
        },
        ink: {
          DEFAULT: "#f4f6fa",
          muted: "#bcc4d4",
          softer: "#8b95aa",
          faint: "#5d6679",
        },
        glow: {
          blue: "#4f8cff",
          violet: "#a78bfa",
          accent: "#d6ff3f",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "Times New Roman", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      animation: {
        "spin-slow": "spin 12s linear infinite",
        drift: "drift 26s ease-in-out infinite",
        floaty: "floaty 7s ease-in-out infinite",
        marquee: "marquee 34s linear infinite",
        "pulse-dot": "pulseDot 2.4s ease-in-out infinite",
        shine: "shine 4.5s ease-in-out infinite",
        "rise-in": "riseIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fadeIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
      keyframes: {
        spin: { to: { transform: "rotate(360deg)" } },
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "33%": { transform: "translate3d(4%, -3%, 0) scale(1.08)" },
          "66%": { transform: "translate3d(-3%, 4%, 0) scale(0.95)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        marquee: { to: { transform: "translateX(-50%)" } },
        pulseDot: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 0 0 var(--ring)" },
          "50%": { opacity: "0.6", boxShadow: "0 0 0 6px transparent" },
        },
        shine: {
          "0%": { transform: "translateX(-120%)" },
          "60%, 100%": { transform: "translateX(220%)" },
        },
        riseIn: {
          from: { opacity: "0", transform: "translateY(26px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(100deg, var(--glow-accent), #9ef7c4 45%, var(--glow-blue))",
      },
    },
  },
};
