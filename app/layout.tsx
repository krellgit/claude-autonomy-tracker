import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claude Code Autonomy Tracker",
  description: "Track and measure how long Claude Code can work autonomously",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <header className="bg-gray-800 text-white py-3 px-4">
          <div className="container mx-auto">
            <h1 className="text-xl font-bold">Claude Code Autonomy Tracker</h1>
          </div>
        </header>
        <main className="container mx-auto p-4 py-6">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-3 px-4 mt-8">
          <div className="container mx-auto text-center text-xs text-gray-400">
            <p>&copy; 2026 longcc.the-ppc-geek.org</p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
