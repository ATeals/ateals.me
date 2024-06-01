import { MDXWapper } from "@/components/MDXWapper";
import { Post as PostType } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";

import { HeadingComponentsBuilder } from "@/components/MDX/HeadingComponents";

import "@/styles/callout.css";

export const PostBody = ({ post }: { post: PostType }) => {
  const MDXComponent = getMDXComponent(post.body.code);

  return (
    <MDXWapper>
      <MDXComponent
        components={{
          h1: HeadingComponentsBuilder("h1"),
          h2: HeadingComponentsBuilder("h2"),
          h3: HeadingComponentsBuilder("h3"),
        }}
      />
    </MDXWapper>
  );
};
