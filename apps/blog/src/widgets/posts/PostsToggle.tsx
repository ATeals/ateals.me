import { Separator } from "@/components/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { HTMLProps } from "react";

interface PostsToggleProps extends HTMLProps<HTMLDivElement> {
  type?: "docs" | "post";
}

export const PostsToggle = ({ type }: PostsToggleProps) => {
  return (
    <div className="flex h-6 items-center my-4">
      <Link href={"posts"} className={cn(type === undefined && "text-secondary-md")}>
        all
      </Link>

      <Separator orientation="vertical" className="m-2" />

      <Link href={"posts?type=post"} className={cn(type === "post" && "text-secondary-md")}>
        blog
      </Link>

      <Separator orientation="vertical" className="m-2" />

      <Link href={"posts?type=docs"} className={cn(type === "docs" && "text-secondary-md")}>
        docs
      </Link>
    </div>
  );
};
