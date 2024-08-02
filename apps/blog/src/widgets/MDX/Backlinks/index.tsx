import Link from "next/link";
import { HTMLProps } from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DocumentBuilder } from "@/service/mdx";
import { PostBody } from "@/widgets/posts/PostBody";
import { PreviewPostTooltip } from "./PreviewPostTooltip";

export const Backlinks = ({ className, children, ...props }: HTMLProps<HTMLParagraphElement>) => {
  const matcher = /^\[\[.*\]\]$/;

  const isBackLink = typeof children === "string" && matcher.test(children);

  if (!isBackLink)
    return (
      <p className={className} {...props}>
        {children}
      </p>
    );

  const [original, alias] = children.replace(/^\[\[|\]\]$/g, "").split(/\|\s*/);

  const backLinkLabel = alias || original;

  return <BacklinksPreview>{backLinkLabel}</BacklinksPreview>;
};

export const BacklinksPreview = ({ children }: HTMLProps<HTMLButtonElement>) => {
  const post = new DocumentBuilder().getDocuments().find((post) => post.title === children);

  if (!post) return <>{children}</>;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Link href={post?.url} className="text-secondary-md">
            {children}
          </Link>
        </TooltipTrigger>
        <TooltipContent className="overflow-scroll h-[600px] w-1/2">
          <PreviewPostTooltip post={post}>
            <PostBody post={post} />
          </PreviewPostTooltip>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
