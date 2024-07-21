import { FieldDefs, defineDocumentType, makeSource } from "contentlayer/source-files";

import remarkGfm from "remark-gfm";
import remarkCallout from "remark-callout";
import rehypePrettyCode from "rehype-pretty-code";

import { rehypePrettyCodeOptions } from "./src/config/rehypePrettyCodeOptions";
import { remarkCalloutOptions } from "./src/config/remarkCalloutOptions";

const fields: FieldDefs = {
  title: { type: "string", required: true },
  description: { type: "string" },
  date: { type: "date", required: true },
  image: { type: "string", default: "/images/main.webp" },
  draft: { type: "boolean" },
  tags: { type: "list", of: { type: "string" } },
};

export const Blog = defineDocumentType(() => ({
  name: "post",
  filePathPattern: `blog/**/*.mdx`,
  contentType: "mdx",
  fields,
  computedFields: {
    pageID: { type: "string", resolve: (post) => encodeURIComponent(post.title) },
    url: { type: "string", resolve: (post) => `/posts/${encodeURIComponent(post.title)}` },
  },
}));

export const Docs = defineDocumentType(() => ({
  name: "docs",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields,
  computedFields: {
    pageID: { type: "string", resolve: (post) => encodeURIComponent(post.title) },
    url: { type: "string", resolve: (post) => `/posts/${encodeURIComponent(post.title)}` },
  },
}));

export default makeSource({
  contentDirPath: "../../documents/",
  documentTypes: [Blog, Docs],
  mdx: {
    remarkPlugins: [[remarkCallout as any, remarkCalloutOptions], [remarkGfm as any]],
    rehypePlugins: [[rehypePrettyCode as any, rehypePrettyCodeOptions]],
  },
});
