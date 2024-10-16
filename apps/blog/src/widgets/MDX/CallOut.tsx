import { cn } from "@/lib/utils";
import { HTMLProps } from "react";

export const Callout = ({ className, ...props }: HTMLProps<HTMLQuoteElement>) => {
  const tw = cn("2xl:absolute 2xl:translate-x-[180%] 2xl:translate-y-[-50%] 2xl:w-[400px]", className);

  return ["quote", "info"].some((tag) => className?.includes(tag)) ? (
    <blockquote className={tw} {...props} /> // 콜아웃 스타일
  ) : (
    <blockquote className={className} {...props} /> // 일반 인용문
  );
};
