import { cn } from "@repo/shadcn/utils";
import { usePostContext } from "./PostProvider";

export const PostTitle = ({
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
