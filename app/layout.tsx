import type { Metadata } from "next";
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
        <header className="bg-gray-800 text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Claude Code Autonomy Tracker</h1>
            <p className="text-sm text-gray-300">Measure autonomous work periods</p>
          </div>
        </header>
        <main className="container mx-auto p-4">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 mt-8">
          <div className="container mx-auto text-center text-sm">
            <p>&copy; 2026 Claude Code Autonomy Tracker</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
