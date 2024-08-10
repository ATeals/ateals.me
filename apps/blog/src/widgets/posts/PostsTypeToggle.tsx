"use client";

import { Separator } from "@/components/ui";
import { POST_TYPES } from "@/config";
import { useQueryParams } from "@/hooks/useQueryParams";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Fragment, HTMLProps } from "react";

interface PostsToggleProps extends HTMLProps<HTMLDivElement> {}

export const PostsTypeToggle = ({}: PostsToggleProps) => {
  const query = useQueryParams();

  const currentType = query.get("type") || "";

  return (
    <div className="flex h-6 items-center">
      {POST_TYPES.map(({ type, title }, i) => (
        <Fragment key={type}>
          {i !== 0 && <Separator className="mx-2" orientation="vertical" />}
          <Link
            replace
            href={`posts?${query.stringify(["type", type])}`}
            className={cn(currentType === type && "text-secondary-md")}
          >
            {title}
          </Link>
        </Fragment>
      ))}
    </div>
  );
};
