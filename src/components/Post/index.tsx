import { cn } from "@/lib/utils";
import { getPostNavigation } from "@/service/mdx";
import { Slot } from "@radix-ui/react-slot";
import { Post as PostType } from "contentlayer/generated";
import { parseISO, format } from "date-fns";
import { ReactNode, createContext, useContext } from "react";
import { Button } from "../shadcn/ui/button";
import Link from "next/link";
import { Separator } from "../shadcn/ui/separator";

const PostContext = createContext<PostType | undefined>(undefined);

const usePostContext = () => {
  const post = useContext(PostContext);

  if (!post) {
    throw new Error("PostContext에 Post가 존재하지 않습니다. PostProvider로 감싸주세요.");
  }

  return post;
};

const PostProvider = ({ post, children }: { post: PostType; children: ReactNode }) => {
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
  children?: ({ next, prev }: { next?: PostType; prev?: PostType }) => React.ReactNode;
}) => {
  const post = usePostContext();

  const { prev, next } = getPostNavigation(post);

  return typeof children === "function" ? (
    children({ prev, next })
  ) : (
    <>
      <Separator className="my-10" />
      <div className={cn(className, "flex, justify-between, items-baseline")} {...props}>
        <Button variant={"outline"} asChild>
          {prev && <Link href={prev.url}> {`< ${prev.title} `}</Link>}
        </Button>
        <Button variant={"outline"} asChild>
          {next && <Link href={next.url}> {` ${next.title} >`}</Link>}
        </Button>
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
  }
);
