import { getPostNavigation } from "@/service/mdx";
import Link from "next/link";
import { Button, Separator } from "@repo/shadcn/components";
import { cn } from "@repo/shadcn/utils";
import { Document } from "@/service/mdx/post";
import { usePostContext } from "./PostProvider";

export const PostNavigation = ({
  className,
  children,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  children?: ({ next, prev }: { next?: Document; prev?: Document }) => React.ReactNode;
}) => {
  const post = usePostContext();

  const { prev, next } = getPostNavigation(post);

  return typeof children === "function" ? (
    children({ prev, next })
  ) : (
    <>
      <Separator className="my-10" />
      <div className={cn(className)} {...props}>
        <div>{prev && <NavigationButton post={prev} direction="prev" />}</div>
        <div>{next && <NavigationButton post={next} direction="next" />}</div>
      </div>
    </>
  );
};

const NavigationButton = ({ post, direction }: { post: Document; direction: "prev" | "next" }) => {
  return (
    <Button
      variant={"ghost"}
      className={cn("w-full font-extralight gap-1", direction === "prev" ? "justify-normal" : "justify-end")}
      asChild
    >
      <Link className={cn(direction === "prev" ? "text-left items-start " : "text-right")} href={post.url}>
        {direction === "prev" && <span>{"이전 글"}</span>}
        <span className="font-medium w-4/5 truncate">{post.title}</span>
        {direction === "next" && <span>{"다음 글"}</span>}
      </Link>
    </Button>
  );
};
