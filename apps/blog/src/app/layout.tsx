import { Analytics } from "@vercel/analytics/react";

import { GeistSans } from "geist/font/sans";
import { BlurSection } from "@/widgets/BlurSection";

import "@/styles/globals.css";
import { ThemeProvider } from "@/widgets/providers/ThemeProvider";
import { Footer } from "@/widgets/Footer";

export { generateMetadata } from "./metadata";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        <meta name="google-site-verification" content="U3213RTjnL2MBwyxUP3W66hcIIqcwV24irUIYoSkKzQ" />
      </head>

      <link rel="alternate" type="application/rss+xml" href="/feed/rss" title="RSS" />
      <link rel="alternate" type="application/atom+xml" href="/feed/atom" title="RSS Atom" />
      <link rel="alternate" type="application/json" href="/feed/json" title="JSON Feed" />
      <body className="" style={GeistSans.style}>
        <BlurSection />

        <ThemeProvider>
          <main className="min-h-dvh bg-white dark:bg-dark-bg transition-colors ease-in-out duration-500">
            {children}
          </main>
        </ThemeProvider>

        <Footer />

        <Analytics />
      </body>
    </html>
  );
}
