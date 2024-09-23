import { ReactNode } from "react";
import { Slot } from "@repo/shadcn/components";
import { cn } from "@repo/shadcn/utils";

export const PostHighLight = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <Slot
      className={cn(
        className,
        "group-hover/post:cursor-pointer group-hover/post:bg-primary-sm group-hover/post:bg-opacity-25 group-hover/post:shadow-sm group-hover/post:shadow-primary-md px-1 rounded-lg "
      )}
    >
      {children}
    </Slot>
  );
};
