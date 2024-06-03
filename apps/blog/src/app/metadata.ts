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
  };
};
