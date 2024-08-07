"use client";

import { Switch } from "@/components/common";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Document } from "@/service/mdx/post";
import { HTMLProps } from "react";
import { cn } from "@/lib/utils";
import { YearGroupPostList } from "./PostList";
import { VIEW_TYPES } from "./const";

export const TogglePostList = ({ posts, className, ...props }: { posts: Document[] } & HTMLProps<HTMLDivElement>) => {
  const [getQuery, gen] = useQueryParams();

  const viewType = getQuery("view");

  const tw = cn("mt-10", className);

  return (
    <div className={tw} {...props}>
      <Switch
        value={viewType as keyof typeof VIEW_TYPES}
        caseBy={{
          LIST: <VIEW_TYPES.LIST.component $key={gen()} posts={posts} />,
          CARD: <VIEW_TYPES.CARD.component $key={gen()} posts={posts} />,
          LOG: <VIEW_TYPES.LOG.component $key={gen()} posts={posts} />,
        }}
        defaultComponent={<YearGroupPostList posts={posts} />}
      />
    </div>
  );
};
