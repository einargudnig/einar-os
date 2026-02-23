import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "@/components/convex-provider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
          <ConvexClientProvider>
            <main className="container relative mx-auto mt-8 overflow-auto p-2">
              <Navbar />
              {children}
              <Analytics />
              <SpeedInsights />
            </main>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
