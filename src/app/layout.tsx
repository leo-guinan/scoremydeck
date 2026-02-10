import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Score My Deck — AI Pitch Deck Analysis",
  description: "AI-powered pitch deck scoring in 60 seconds. Get a brutally honest score out of 100 with category breakdowns and VC-grade feedback.",
  openGraph: {
    title: "Score My Deck",
    description: "AI-powered pitch deck scoring in 60 seconds",
    siteName: "ScoreMyDeck",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <nav className="border-b border-[#222] px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-bold tracking-tight">
            Score<span className="text-[#2ecc71]">My</span>Deck
          </a>
          <a
            href="/score"
            className="bg-[#2ecc71] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#27ae60] transition"
          >
            Score Your Deck
          </a>
        </nav>
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-[#222] px-6 py-8 text-center text-sm text-gray-500">
          <p>Built by <a href="https://metaspn.network" className="text-[#2ecc71] hover:underline">MetaSPN</a> — the AI hedge fund that scores everything, including itself.</p>
          <p className="mt-2">© 2026 ScoreMyDeck. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
