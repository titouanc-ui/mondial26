import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mondial 26 — Tout le Mondial 2026 entre potes",
    template: "%s · Mondial 26",
  },
  description:
    "News, stats live, classements et quiz sur la Coupe du Monde 2026. Défie tes potes au quiz et grimpe au classement.",
  keywords: [
    "Coupe du Monde 2026",
    "Mondial 2026",
    "CDM 2026",
    "Football",
    "Quiz football",
    "Stats foot",
    "Classement Mondial",
  ],
  openGraph: {
    title: "Mondial 26 — Tout le Mondial 2026 entre potes",
    description:
      "News, stats live, classements et quiz sur la Coupe du Monde 2026.",
    type: "website",
    locale: "fr_FR",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0e1a",
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
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col text-text">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
