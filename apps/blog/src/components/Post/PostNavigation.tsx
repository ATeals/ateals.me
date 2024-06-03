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
      <div className={cn(className, "flex, justify-between items-center gap-2")} {...props}>
        <div className="w-1/2">
          {prev && (
            <Button variant={"outline"} className="w-full whitespace-pre-wrap space-x-2" asChild>
              {prev && (
                <Link className="" href={prev.url}>
                  <span>{"<"}</span>
                  <span>{prev.title}</span>
                </Link>
              )}
            </Button>
          )}
        </div>
        <div className="w-1/2">
          {next && (
            <Button variant={"outline"} className="w-full whitespace-pre-wrap space-x-2" asChild>
              {
                <Link className="" href={next.url}>
                  <span>{next.title}</span>
                  <span>{">"}</span>
                </Link>
              }
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
