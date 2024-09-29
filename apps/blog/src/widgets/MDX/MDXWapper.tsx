import { cn } from "@repo/shadcn/utils";

import "@/styles/codeHighlight.css";

export const MDXWapper = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(MARKDOWN_STYLE_CLASSNAME, className)}>{children}</div>
);

const MARKDOWN_STYLES = {
  base: ["mdx", "px-2 md:px-0", "prose prose-stone", "dark:prose-invert", "prose-strong:dark:text-zinc-300"],
  paragraph: [
    "prose-p:break-words",
    "prose-p:text-gray-700 dark:prose-p:text-gray-300",
    "prose-p:font-[350]",
    "prose-p:mb-8",
  ],
  headings: [
    "prose-headings:mt-24 prose-headings:mb-8",
    "prose-h1:text-2xl",
    "prose-h2:text-xl",
    "prose-h2:font-medium",
    "prose-h3:text-lg",
  ],
  blockquote: [
    "prose-quoteless",
    "dark:prose-blockquote:text-zinc-400",
    "dark:prose-blockquote:bg-zinc-800",
    "prose-blockquote:not-italic",
    "prose-blockquote:border-primary-lg",
    "dark:prose-blockquote:border-primary-md",
    "prose-blockquote-p:mb-[0.5rem]",
    "prose-blockquote:pr-4",
    "prose-blockquote:bg-slate-50",
    "prose-blockquote:shadow-inner",
    "prose-blockquote:shadow-zinc-300",
    "prose-blockquote:rounded-r-lg",
    "dark:prose-blockquote:bg-zinc-900",
    "dark:prose-blockquote:shadow-inner",
    "dark:prose-blockquote:shadow-black",
    "prose-blockquote:my-8",
  ],
  inlineCode: [
    "prose-inline-code:inline-block",
    "prose-inline-code:px-1",
    "prose-inline-code:font-normal",
    "prose-inline-code:relative",
    "prose-inline-code:-top-[0.125rem]",
    "prose-inline-code:bg-zinc-100",
    "prose-inline-code:text-secondary-lg",
    "prose-inline-code:rounded-md",
    "prose-inline-code:shadow-md",
    "dark:prose-inline-code:shadow-black",
    "dark:prose-inline-code:bg-zinc-900",
    "dark:prose-inline-code:text-secondary-md",
  ],
  code: ["prose-code:before:hidden", "prose-code:after:hidden", "prose-code:text-[0.725rem]"],
  codeBlock: ["prose-pre:shadow-lg", "dark:prose-pre:shadow-black", "prose-pre:p-2", "prose-pre:bg-transparent"],
  image: ["prose-img:shadow-lg", "dark:prose-img:shadow-black"],
  list: ["prose-li:text-gray-700", "dark:prose-li:text-gray-300", "prose-li:font-[350]"],
  table: ["prose-th:text-start"],
} as const;

const MARKDOWN_STYLE_CLASSNAME = Object.values(MARKDOWN_STYLES)
  .map((style) => style.join(" "))
  .join(" ");
