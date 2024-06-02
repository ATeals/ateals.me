import { Separator } from "@/components/ui";
import { POST_TYPES } from "@/config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Fragment, HTMLProps } from "react";

interface PostsToggleProps extends HTMLProps<HTMLDivElement> {
  type?: "docs" | "post";
}

export const PostsToggle = ({ type }: PostsToggleProps) => {
  return (
    <div className="flex h-6 items-center my-4">
      <Link replace href={"posts"} className={cn(type === undefined && "text-secondary-md")}>
        all
      </Link>

      {POST_TYPES.map(({ type: postType, title }) => (
        <Fragment key={postType}>
          <Separator className="mx-2" orientation="vertical" />
          <Link
            replace
            href={`posts?type=${postType}`}
            className={cn(type === postType && "text-secondary-md")}
          >
            {title}
          </Link>
        </Fragment>
      ))}
    </div>
  );
};
