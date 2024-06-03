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
      <div className={cn(className, "flex, justify-between, items-center")} {...props}>
        {prev ? (
          <Button variant={"outline"} asChild>
            {prev && <Link href={prev.url}> {`< ${prev.title} `}</Link>}
          </Button>
        ) : (
          <div />
        )}
        {next ? (
          <Button variant={"outline"} asChild>
            {<Link href={next.url}> {` ${next.title} >`}</Link>}
          </Button>
        ) : (
          <div />
        )}
      </div>
    </>
  );
};
