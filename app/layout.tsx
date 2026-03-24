import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "@/components/convex-provider";
import { KeyboardNav } from "@/components/keyboard-nav";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BirthdayConfetti } from "@/components/birthday-confetti";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Einar Gudni",
  description: "My home on the web 🏡",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased mb-10 lg:mx-auto`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <BirthdayConfetti />
          <ConvexClientProvider>
            <main className="relative mx-auto mt-8 max-w-4xl overflow-auto px-6 md:px-8">
              <Navbar />
              {children}
              <footer className="mt-16 mb-8 border-t border-border/50 pt-6 flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span>don't half ass it</span>
                <span className="tabular-nums">{new Date().getFullYear()}</span>
              </footer>
              <KeyboardNav />
              <Analytics />
              <SpeedInsights />
            </main>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
