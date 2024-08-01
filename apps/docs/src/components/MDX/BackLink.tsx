import siteConfig from "@/config/siteConfig";
import Link from "next/link";
import React, { HTMLProps } from "react";

export const Backlink = ({ className, children, ...props }: HTMLProps<HTMLParagraphElement>) => {
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

  return (
    <Link
      href={`${siteConfig.URL.BLOG}/snapshots/${backLinkLabel}`}
      target="_blank"
      style={{
        textDecoration: "underline",
        color: "hsl(var(--nextra-primary-hue)var(--nextra-primary-saturation)45%/var(--tw-text-opacity))",
        display: "inline-block",
      }}
    >
      {backLinkLabel}
    </Link>
  );
};
