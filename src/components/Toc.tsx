"use client";

import { useSelectedHeading } from "@/hooks/useSelectedHeading";
import { cn } from "@/lib/utils";
import { parseToc } from "@/service/mdx";
import { Post } from "contentlayer/generated";

import Link from "next/link";

const HEADING_LEVELS_MAP = {
  1: "mt-5 font-bold",
  2: "mt-5 font-semibold",
  3: "mt-2 font-thin",
};

export const Toc = ({ post }: { post: Post }) => {
  const { activeHeading } = useSelectedHeading();

  const tocHeadings = parseToc(post.body.raw);

  return (
    <ul className="h-[400px] overflow-scroll my-10 scrollbar-hide">
      {tocHeadings.map(({ text, level }, index) => (
        <li
          key={text + level + index}
          style={{ paddingLeft: (level - 2) * 15 }}
          className={cn(
            HEADING_LEVELS_MAP[level],
            " hover:underline hover:text-primary-lg",
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
