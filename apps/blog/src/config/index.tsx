import { title } from "process";
import { IconType } from "react-icons";

import { IoLogoGithub } from "react-icons/io5";

export const SITE_CONFIG = {
  domain: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://blog.ateals.me",
  title: "Blog | Ateals",
  description: "Ateals의 블로그입니다.",
  icons: "/favicon.ico",
  image: "/images/main.webp",
  MAIN_JPG: "images/main.jpg",
  since: "2023",
  owner: {
    name: "ateals",
    email: "ateals@icloud.com",
    link: "https://blog.ateals.me",
  },
};

export const POST_TYPES_ENTITY = {
  post: {
    title: "블로그",
    description: "개발하면서 경험하거나 고민한 것을 작성합니다.",
    url: "/posts?type=post",
    icon: "🖋️",
  },
  docs: {
    title: "저장소",
    description: "공부하거나 읽은 내용을 정리합니다.",
    url: "/posts?type=docs",
    icon: "🗃️",
  },
  snapshot: {
    title: "스냅샷",
    description: "짧은 인사이트를 공유합니다.",
    url: "/posts?type=snapshot",
    icon: "📸",
  },
  link: {
    title: "링크",
    description: "좋은 링크를 공유합니다.",
    url: "/posts?type=link",
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
