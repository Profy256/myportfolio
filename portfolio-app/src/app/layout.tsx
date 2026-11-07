import type { Metadata, Viewport } from "next";
import { Inter_Tight, Sora, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeAndPreloaderProvider } from "@/components/providers/ThemeAndPreloaderProvider";

const sans = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const display = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kafeero Proferious — Software Engineer",
    template: "%s | Kafeero Proferious",
  },
  description:
    "Software engineer in Kampala, Uganda. I build production marketplaces, AI platforms and developer tools with Go, TypeScript, Next.js and Python.",
  metadataBase: new URL("https://profy256.github.io/portfolio-app/"),
  openGraph: {
    type: "website",
    url: "/portfolio-app/",
    title: "Kafeero Proferious — Software Engineer",
    description:
      "Production marketplaces, AI platforms and developer tools in Go, TypeScript, Next.js and Python.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Kafeero Proferious portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kafeero Proferious — Software Engineer",
    description: "Production marketplaces, AI platforms and developer tools.",
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f1" },
    { media: "(prefers-color-scheme: dark)", color: "#070810" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable} ${serif.variable} ${mono.variable}`}
    >
      <body className="antialiased">
        <ThemeAndPreloaderProvider>{children}</ThemeAndPreloaderProvider>
      </body>
    </html>
  );
}
