"use client";

import { useQueryParams } from "@/hooks/useQueryParams";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { HTMLProps } from "react";

interface TagLabelProps extends HTMLProps<HTMLAnchorElement> {
  tag: string;
}

export const TagLabel = ({ tag, className, ...props }: TagLabelProps) => {
  const query = useQueryParams();

  const current = query.get("tags");

  const tw = cn(
    "text-md px-2 hover:cursor-pointer hover:underline hover:drop-shadow-lg whitespace-nowrap",
    tag === current ? "text-secondary-md drop-shadow-lg" : "text-gray-500 dark:text-gray-400",
    className
  );

  return (
    <Link href={`posts?${query.stringify(["tags", tag])}`} className={tw} {...props}>
      {tag}
    </Link>
  );
};
