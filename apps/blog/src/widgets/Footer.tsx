import Link from "next/link";

import { SiNextdotjs } from "react-icons/si";
import { RiTailwindCssFill } from "react-icons/ri";
import { SiMdx } from "react-icons/si";
import { SiObsidian } from "react-icons/si";

import { POST_TYPES } from "@/config";
import { Fragment } from "react";
import { HitBadge } from "./HitBadge";

export const Footer = () => (
  <footer className="relative h-40 bg-zinc-200 p-2 px-5 text-end text-sm text-light text-gray-700 space-y-2.5 dark:bg-dark-highlight dark:text-gray-400">
    <nav className="">
      {POST_TYPES.map(({ title, type }, i) => (
        <Fragment key={type}>
          {i !== 0 && <span className="mx-1"> • </span>}
          <Link className="hover:cursor-pointer hover:underline" href={`/posts?type=${type}`}>
            <span>{title}</span>
          </Link>
        </Fragment>
      ))}
    </nav>

    <p>
      <span>&copy; {new Date().getFullYear()} by </span>
      <Link href="/" className="underline">
        Ateals
      </Link>
    </p>
    <p className="flex gap-2 justify-end my-2">
      <SiNextdotjs /> <RiTailwindCssFill /> <SiMdx /> <SiObsidian />
    </p>

    <HitBadge className="absolute right-0 p-2 px-5 bottom-0" />
  </footer>
);
