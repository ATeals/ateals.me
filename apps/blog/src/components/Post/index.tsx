import { getPostNavigation } from "@/service/mdx";

import { parseISO, format } from "date-fns";
import { ReactNode, createContext, useContext } from "react";
import Link from "next/link";
import { Button, Separator, Slot } from "@repo/shadcn/components";
import { cn } from "@repo/shadcn/utils";

import { Document } from "@/service/mdx/post";

const PostContext = createContext<Document | undefined>(undefined);

const usePostContext = () => {
  const post = useContext(PostContext);

  if (!post) {
    throw new Error("PostContext에 Post가 존재하지 않습니다. PostProvider로 감싸주세요.");
  }

  return post;
};

const PostProvider = ({ post, children }: { post: Document; children: ReactNode }) => {
  return (
    <PostContext.Provider value={post}>
      <Slot className="group/post">{children}</Slot>
    </PostContext.Provider>
  );
};

const PostHighLight = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <Slot
      className={cn(
        className,
        "group-hover/post:cursor-pointer group-hover/post:bg-primary-lg group-hover/post:shadow-md px-1 rounded-lg group-hover/post:text-gray-100"
      )}
    >
      {children}
    </Slot>
  );
};

const PostTitle = ({
  className,
  ...props
}: React.HTMLProps<HTMLHeadingElement> & { enableHover?: boolean }) => {
  const post = usePostContext();

  return (
    <h1 className={cn(className)} {...props}>
      {post.title}
    </h1>
  );
};

const PostAuthor = ({ className, ...props }: React.HTMLProps<HTMLDivElement>) => {
  return <div className={cn("font-light text-gray-500", className)}>{props.children}</div>;
};

const POST_DATE_LABEL_MAP = {
  YEAR: (date: string) => date.slice(0, 4),
  DOT: (date: string) => date.slice(5, 10).replace("-", ". "),
  DEFAULT: (date: string) => format(parseISO(date), "LLLL d, yyyy"),
};

const PostDATELABLE = ({
  dateType = "DEFAULT",
  className,
  ...props
}: React.HTMLProps<HTMLHeadingElement> & {
  enableHover?: boolean;
  dateType?: keyof typeof POST_DATE_LABEL_MAP;
}) => {
  const post = usePostContext();

  const date = POST_DATE_LABEL_MAP[dateType](post.date);

  return (
    <span className={cn(className)} {...props}>
      {date}
    </span>
  );
};

const PostImage = ({ className, ...props }: React.HTMLProps<HTMLImageElement>) => {
  const post = usePostContext();

  return (
    <img src={post.image} alt="preview" className={cn("w-full h-full", className)} {...props} />
  );
};

const PostNavigation = ({
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

export const Post = Object.assign(
  {},
  {
    Provider: PostProvider,
    Title: PostTitle,
    DATELABLE: PostDATELABLE,
    HighLight: PostHighLight,
    Image: PostImage,
    Navigation: PostNavigation,
    Author: PostAuthor,
  }
);
