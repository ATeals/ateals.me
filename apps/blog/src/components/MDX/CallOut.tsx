import { cn } from "@/lib/utils";
import { HTMLProps } from "react";

export const Callout = ({ className, ...props }: HTMLProps<HTMLQuoteElement>) => {
  const tw = cn("xl:absolute xl:translate-x-[150%] xl:translate-y-[-50%] xl:w-[400px]", className);

  return className ? (
    <blockquote className={tw} {...props} /> // 콜아웃 스타일
  ) : (
    <blockquote {...props} /> // 일반 인용문
  );
};
