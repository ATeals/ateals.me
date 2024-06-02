import Link from "next/link";

import { SiNextdotjs } from "react-icons/si";
import { RiTailwindCssFill } from "react-icons/ri";
import { SiMdx } from "react-icons/si";

import { POST_TYPES } from "@/config";

export const Footer = () => (
  <footer className=" h-40 bg-zinc-200 p-2 px-5 text-end text-sm text-light text-gray-700 space-y-2.5 dark:bg-zinc-700 dark:text-gray-400">
    <p>
      <span>&copy; {new Date().getFullYear()} by </span>
      <Link href="/" className="underline">
        Ateals
      </Link>
    </p>
    <p className="flex gap-2 justify-end my-2">
      <SiNextdotjs /> <RiTailwindCssFill /> <SiMdx />
    </p>
    <nav>
      {POST_TYPES.map(({ title, type }) => (
        <Link href={`/posts?type=${type}`} key={type}>
          <p>{title}</p>
        </Link>
      ))}
    </nav>
  </footer>
);
