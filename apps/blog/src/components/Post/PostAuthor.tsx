import { cn } from "@repo/shadcn/utils";

export const PostAuthor = ({ className, ...props }: React.HTMLProps<HTMLDivElement>) => {
  return <div className={cn("font-light text-gray-500", className)}>{props.children}</div>;
};
