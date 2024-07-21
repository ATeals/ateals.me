import { getMDXComponent } from "next-contentlayer/hooks";

import { HeadingComponentsBuilder } from "@/components/MDX/HeadingComponents";
import { IMGComponenets } from "@/components/MDX/IMGComponenets";
import { Callout } from "@/components/MDX/CallOut";

import { Document } from "@/service/mdx/post";

import "@/styles/callout.css";
import { MDXWapper } from "@/components/MDX/MDXWapper";

export const PostBody = ({ post, className }: { post: Document; className?: string }) => {
  const MDXComponent = getMDXComponent(post.body.code);

  return (
    <MDXWapper className={className}>
      <MDXComponent
        components={{
          h1: HeadingComponentsBuilder("h1"),
          h2: HeadingComponentsBuilder("h2"),
          h3: HeadingComponentsBuilder("h3"),
          img: IMGComponenets,
          blockquote: Callout,
        }}
      />
    </MDXWapper>
  );
};
