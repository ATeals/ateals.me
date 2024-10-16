import { SITE_CONFIG } from "@/config";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "Blog | Ateals",
    description: "Ateals의 블로그입니다.",
    icons: "/favicon.ico",
    openGraph: {
      title: "Ateals",
      description: "Ateals의 블로그입니다.",
      images: `${SITE_CONFIG.domain}/images/main.jpg`,
    },
    keywords: [
      "ateals",
      "blog",
      "개발",
      "react",
      "nextjs",
      "typescript",
      "javascript",
      "nestjs",
      "nodejs",
      "frontend",
      "backend",
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "mlTcRHcN0Ek1reeiKlnCuRvRSE-pXkiDkYqVkyvl0cE",
    },
  };
};
