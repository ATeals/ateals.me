"use client";

import { useSelectedHeading } from "@/hooks/useSelectedHeading";
import { parseToc } from "@/service/mdx";
import { Document } from "@/service/mdx/post";
import { cn } from "@repo/shadcn/utils";

import Link from "next/link";

const HEADING_LEVELS_MAP = {
  1: "mb-8 font-bold",
  2: "pt-2 font-semibold",
  3: "pt-2 border-r border-r-zinc-200 font-thin",
};

export const Toc = ({ post }: { post: Document }) => {
  const { activeHeading } = useSelectedHeading();

  const tocHeadings = parseToc(post.body.raw);

  return (
    <ul className="max-h-[700px] overflow-scroll my-10 scrollbar-hide ">
      {tocHeadings.map(({ text, level }, index) => (
        <li
          key={text + level + index}
          style={{ marginRight: (level - 2) * 5, paddingRight: (level - 2) * 5 }}
          className={cn(
            HEADING_LEVELS_MAP[level],
            " hover:underline hover:text-primary-lg mr-2",
            activeHeading.value === text && activeHeading.level === level && "text-secondary-md"
          )}
        >
          <Link href={`#${text}`} replace>
            {text}
          </Link>
        </li>
      ))}
    </ul>
  );
};
