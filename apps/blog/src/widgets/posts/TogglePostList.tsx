"use client";

import { Switch } from "@/components/common";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Document } from "@/service/mdx/post";
import { HTMLProps } from "react";
import { cn } from "@/lib/utils";
import { YearGroupPostList } from "./PostList";
import { VIEW_TYPES } from "./const";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useIsMounted } from "@/hooks/useIsMounted";

export const TogglePostList = ({ posts, className, ...props }: { posts: Document[] } & HTMLProps<HTMLDivElement>) => {
  const [storage] = useLocalStorage("viewType", { initialValue: "LIST" });
  const isMounted = useIsMounted();

  const query = useQueryParams();

  const viewType = query.get("view") || storage;

  const tw = cn("mt-10", className);

  if (!isMounted) return <></>;

  return (
    <div className={tw} {...props}>
      <Switch
        value={viewType as keyof typeof VIEW_TYPES}
        caseBy={{
          LIST: <VIEW_TYPES.LIST.component $key={query.stringify()} posts={posts} />,
          CARD: <VIEW_TYPES.CARD.component $key={query.stringify()} posts={posts} />,
          LOG: <VIEW_TYPES.LOG.component $key={query.stringify()} posts={posts} />,
        }}
        defaultComponent={<YearGroupPostList posts={posts} />}
      />
    </div>
  );
};
