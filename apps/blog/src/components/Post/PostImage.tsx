import { cn } from "@repo/shadcn/utils";
import { usePostContext } from "./PostProvider";

export const PostImage = ({ className, ...props }: React.HTMLProps<HTMLImageElement>) => {
  const post = usePostContext();

  return (
    <img src={post.image} alt="preview" className={cn("w-full h-full", className)} {...props} />
  );
};
