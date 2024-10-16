import { Analytics } from "@vercel/analytics/react";

import { GeistSans } from "geist/font/sans";
import { BlurSection } from "@/widgets/BlurSection";

import "@/styles/globals.css";
import { ThemeProvider } from "@/widgets/providers/ThemeProvider";
import { Footer } from "@/widgets/Footer";
import { CMDK } from "@/widgets/CMDK";
import { CMDProvider } from "@/hooks/useCmdK";
import { GoogleAnalytics } from "@next/third-parties/google";

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

        {/* blog.ateals.me */}
        <meta name="naver-site-verification" content="2d9e9c7acfe720cca4cbb93b0bfa30213ed8d9c1" />
        <meta name="google-site-verification" content="U3213RTjnL2MBwyxUP3W66hcIIqcwV24irUIYoSkKzQ" />

        {/* blog.ateals.site
        <meta name="google-site-verification" content="mlTcRHcN0Ek1reeiKlnCuRvRSE-pXkiDkYqVkyvl0cE" /> */}

        {/* vercel 도메인용 구글 웹마스터 도구 tag */}
        <meta name="google-site-verification" content="SWzdnKcr1a_u4qCWr_61fw6PxQf4NZkXWHl1aDrwaeg" />
      </head>

      <body className="" style={GeistSans.style}>
        <BlurSection />

        <ThemeProvider>
          <CMDProvider>
            <main className="min-h-dvh bg-white dark:bg-dark-bg transition-colors ease-in-out duration-500">
              {children}
            </main>
            <CMDK />
          </CMDProvider>
        </ThemeProvider>

        <Footer />

        <Analytics />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!} />
      </body>
    </html>
  );
}
