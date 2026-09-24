import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif, Space_Mono, Syne } from "next/font/google";
import { profile } from "@/lib/data";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${profile.full_name} — Digital systems, made legible.`,
  description:
    "Portofolio Ekabekti, full-stack developer dan infrastructure architect yang membangun sistem digital untuk operasional yang lebih tenang, cepat, dan accountable.",
  openGraph: {
    title: `${profile.full_name} — Digital systems, made legible.`,
    description: profile.bio,
    siteName: "Ekabekti / Systems",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0e0c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${syne.variable} ${dmSans.variable} ${instrumentSerif.variable} ${spaceMono.variable}`}>
      <body>
        <div className="site-grid" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
