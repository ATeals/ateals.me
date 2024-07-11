import { cn } from "@repo/shadcn/utils";

import "@/styles/codeHighlight.css";

export const MDXWapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "mdx",
      "px-2 md:px-0",
      "prose-p:text-gray-700",
      "prose-a:dark:text-primary-sm prose-a:text-primary-lg",
      "prose-p:break-words prose-p:text-gray-700 dark:prose-p:text-gray-400 prose-p:font-[350]",
      "dark:prose-invert",
      "prose prose-stone",
      "prose-strong:dark:text-zinc-300",
      "prose-quoteless dark:prose-blockquote:text-zinc-800",
      "prose-blockquote:not-italic",
      "prose-h1:text-2xl",
      "prose-h2:text-xl prose-h2:font-medium",
      "prose-h3:text-lg",
      "prose-headings:mt-20 mb-4",
      "prose-inline-code:p-1 prose-inline-code:font-normal prose-inline-code:bg-zinc-200 prose-inline-code:text-secondary-lg prose-inline-code:rounded-md prose-inline-code:shadow-md dark:prose-inline-code:bg-zinc-500 dark:prose-inline-code:text-secondary-md",
      "prose-code:before:hidden prose-code:after:hidden",
      "prose-img:shadow-lg",
      "prose-pre:shadow-lg prose-pre:p-2 prose-pre:bg-transparent",
      "prose-li:text-gray-700 dark:prose-li:text-gray-400 prose-li:font-[350]",
      "prose-code:text-[0.8rem]",
      className
    )}
  >
    {children}
  </div>
);
