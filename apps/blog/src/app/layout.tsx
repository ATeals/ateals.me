import { Analytics } from "@vercel/analytics/react";

import { GeistSans } from "geist/font/sans";
import { BlurSection } from "@/widgets/BlurSection";

import "@/styles/globals.css";
import { ThemeProvider } from "@/widgets/providers/ThemeProvider";

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

        <meta
          name="google-site-verification"
          content="U3213RTjnL2MBwyxUP3W66hcIIqcwV24irUIYoSkKzQ"
        />
      </head>
      <body className="dark:bg-dark-bg" style={GeistSans.style}>
        <ThemeProvider>
          <BlurSection />
          {children}
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  );
}
