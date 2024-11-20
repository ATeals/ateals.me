import { DOCUMENT_TYPES } from "@/service/mdx/post";
import { IconType } from "react-icons";

import { IoLogoGithub } from "react-icons/io5";

export const SITE_CONFIG = {
  domain: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://blog-ateals.vercel.app",
  subDomain: "https://blog-ateals.vercel.app",
  title: "Blog | Ateals",
  description: "Ateals의 블로그입니다.",
  icons: "/favicon.ico",
  image: "/images/main.webp",
  MAIN_JPG: "images/main.jpg",
  since: "2023",
  owner: {
    name: "ateals",
    email: "ateals@icloud.com",
    link: "https://blog-ateals.vercel.app",
    github: "https://github.com/ATeals",
  },
};

export const POST_TYPES_ENTITY = {
  "": {
    title: "모든글",
    description: "블로그의 모든 글.",
    url: "/posts",
    icon: "📚",
  },
  Blog: {
    title: "블로그",
    description: "개발하면서 경험하거나 고민한 것을 작성합니다.",
    url: `/posts?type=${DOCUMENT_TYPES.BLOG}`,
    icon: "🖋️",
  },
  Docs: {
    title: "저장소",
    description: "공부하거나 읽은 내용을 정리합니다.",
    url: `/posts?type=${DOCUMENT_TYPES.DOCS}`,
    icon: "🗃️",
  },
  Snapshot: {
    title: "스냅샷",
    description: "짧은 인사이트를 공유합니다.",
    url: `/posts?type=${DOCUMENT_TYPES.SNAPSHOT}`,
    icon: "📸",
  },
  Link: {
    title: "링크",
    description: "좋은 링크를 공유합니다.",
    url: `/posts?type=${DOCUMENT_TYPES.LINK}`,
    icon: "🔗",
  },
};

export const POST_TYPES = Object.entries(POST_TYPES_ENTITY).flatMap(([type, value]) => ({
  type: type,
  ...value,
}));

export interface LinkIcon {
  name: string;
  url: string;
  Icon: string | IconType;
}

export const SOCIAL_LINKS: LinkIcon[] = [
  {
    name: "Github",
    url: "https://github.com/ATeals",
    Icon: IoLogoGithub,
  },
];

export const WEB_LINKS: LinkIcon[] = [
  {
    name: "Blog",
    url: SITE_CONFIG.domain,
    Icon: "🖋️",
  },
  {
    name: "Documents",
    url: "https://docs.ateals.me",
    Icon: "📚",
  },
  {
    name: "Email",
    url: "mailto:ateals@icloud.com",
    Icon: "📮",
  },
];
