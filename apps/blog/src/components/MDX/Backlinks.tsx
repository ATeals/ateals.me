import Link from "next/link";
import { HTMLProps } from "react";

export const Backlinks = ({ className, children, ...props }: HTMLProps<HTMLParagraphElement>) => {
  const matcher = /^\[\[.*\]\]$/;

  const isBackLink = typeof children === "string" && matcher.test(children);

  if (!isBackLink)
    return (
      <p className={className} {...props}>
        {children}
      </p>
    );

  const backLinkLabel = children.replace("[[", "").replace("]]", "");

  return <Link href={`/posts/${backLinkLabel}`}>{backLinkLabel}</Link>;
};
