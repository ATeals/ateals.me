import type { Metadata } from "next";

import { GeistSans } from "geist/font/sans";
import { BlurSection } from "@/widgets/BlurSection";

import "@/styles/globals.css";
import { ThemeProvider } from "@/widgets/providers/ThemeProvider";

export const generateMetadata = (): Metadata => {
  return {
    title: "Ateals",
    description: "Ateals의 블로그입니다.",
    icons: "/favicon.ico",
    openGraph: {
      title: "Ateals",
      description: "Ateals의 블로그입니다.",
      images: [{ url: "/images/main.webp" }],
    },
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="dark:bg-dark-bg" style={GeistSans.style}>
        <ThemeProvider>
          <BlurSection />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
