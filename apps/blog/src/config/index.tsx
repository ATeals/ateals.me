import { CiMail, CiPen } from "react-icons/ci";
import { FaGithub } from "react-icons/fa";

export const siteConfig = {
  domain:
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://blog.ateals.me",
  title: "Blog | Ateals",
  description: "Ateals의 블로그입니다.",
  icons: "/favicon.ico",
  image: "/images/main.webp",
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
};

export const POST_TYPES = Object.entries(POST_TYPES_ENTITY).flatMap(([type, value]) => ({
  type: type,
  ...value,
}));

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

export const SOCIAL_LINKS = [
  {
    name: "Github",
    url: "https://github.com/ATeals",
    Icon: FaGithub,
  },
  {
    name: "Website",
    url: siteConfig.domain,
    Icon: CiPen,
  },
  {
    name: "Email",
    url: "mailto:ateals@icloud.com",
    Icon: CiMail,
  },
];
