import { FieldDefs, defineDocumentType, makeSource } from "contentlayer/source-files";

import remarkGfm from "remark-gfm";
import remarkCallout from "remark-callout";
import rehypePrettyCode from "rehype-pretty-code";

const fields: FieldDefs = {
  title: { type: "string", required: true },
  description: { type: "string", required: true },
  date: { type: "date", required: true },
  image: { type: "string", default: "/images/main.webp" },
  draft: { type: "boolean" },
  tags: { type: "list", of: { type: "string" } },
};

interface NavigationPost {
  url?: string;
  title?: string;
}

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields,
  computedFields: {
    url: { type: "string", resolve: (post) => `/posts${post._raw.flattenedPath}` },
  },
}));

export default makeSource({
  contentDirPath: "posts",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm as any, remarkCallout as any],
    rehypePlugins: [[rehypePrettyCode as any, { theme: "github-dark" }]],
  },
});
