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

export const Blog = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `blog/**/*.mdx`,
  contentType: "mdx",
  fields,
  computedFields: {
    url: { type: "string", resolve: (post) => `/posts/${post._raw.flattenedPath}` },
  },
}));

export const Docs = defineDocumentType(() => ({
  name: "Docs",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields,
  computedFields: {
    url: { type: "string", resolve: (post) => `/posts/${post._raw.flattenedPath}` },
  },
}));

export default makeSource({
  contentDirPath: "../../documents/",
  documentTypes: [Blog, Docs],
  mdx: {
    remarkPlugins: [remarkGfm as any, remarkCallout as any],
    rehypePlugins: [[rehypePrettyCode as any, { theme: "github-dark" }]],
  },
});
