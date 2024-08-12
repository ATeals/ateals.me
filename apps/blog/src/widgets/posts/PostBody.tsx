import { getMDXComponent } from "next-contentlayer/hooks";

import { HeadingComponentsBuilder } from "@/widgets/MDX/HeadingComponents";
import { IMGComponenets } from "@/widgets/MDX/IMGComponenets";
import { Callout } from "@/widgets/MDX/CallOut";

import { Document } from "@/service/mdx/post";

import "@/styles/callout.css";
import { MDXWapper } from "@/widgets/MDX/MDXWapper";
import { OutLink } from "../MDX/OutLink";
import { Paragraph } from "../MDX/Paragraph";

const CostomComponents = {
  h1: HeadingComponentsBuilder("h1"),
  h2: HeadingComponentsBuilder("h2"),
  h3: HeadingComponentsBuilder("h3"),
  img: IMGComponenets,
  blockquote: Callout,
  p: Paragraph,
  a: OutLink,
};

export const PostBody = ({ post, className }: { post: Document; className?: string }) => {
  const MDXComponent = getMDXComponent(post.body.code);

  return (
    <MDXWapper className={className}>
      <MDXComponent components={CostomComponents} />
    </MDXWapper>
  );
};
