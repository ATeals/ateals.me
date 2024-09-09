import { FieldDefs, defineDocumentType, makeSource } from "contentlayer/source-files";

import remarkGfm from "remark-gfm";
import remarkCallout from "remark-callout";
import rehypePrettyCode from "rehype-pretty-code";

import { rehypePrettyCodeOptions } from "./src/config/rehypePrettyCodeOptions";
import { remarkCalloutOptions } from "./src/config/remarkCalloutOptions";
import { Document } from "contentlayer/core";

const fields: FieldDefs = {
  title: { type: "string", required: true },
  description: { type: "string" },
  date: { type: "date", required: true },
  image: { type: "string", default: "https://blog.ateals.me/images/main.webp" },
  draft: { type: "boolean" },
  tags: { type: "list", of: { type: "string" } },
  enTitle: { type: "string" },
} as const;

const computedFields = {
  pageID: {
    type: "string",
    resolve: <T extends Document>(post: T) => createSlugFromTitle(post),
  },
  url: {
    type: "string",
    resolve: <T extends Document>(post: T) => `/posts/${createSlugFromTitle(post)}`,
  },

  src: {
    type: "string",
    resolve: <T extends Document>(post: T) => post._raw.sourceFileDir.match(/\/(.+)/)?.[1] ?? "",
  },
} as const;

export const Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: `blog/**/*.mdx`,
  contentType: "mdx",
  fields,
  computedFields,
}));

export const Docs = defineDocumentType(() => ({
  name: "Docs",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields,
  computedFields,
}));

export const Link = defineDocumentType(() => ({
  name: "Link",
  filePathPattern: `links/**/*.mdx`,
  contentType: "mdx",
  fields: {
    ...fields,
    url: { type: "string", required: true },
    pageID: { type: "string" },
  },
}));

export const Snapshot = defineDocumentType(() => ({
  name: "Snapshot",
  filePathPattern: `snapshots/**/*.mdx`,
  contentType: "mdx",
  fields,
  computedFields,
}));

export default makeSource({
  contentDirPath: "../../documents/",
  documentTypes: [Blog, Docs, Link, Snapshot],
  mdx: {
    remarkPlugins: [[remarkCallout as any, remarkCalloutOptions], [remarkGfm as any]],
    rehypePlugins: [[rehypePrettyCode as any, rehypePrettyCodeOptions]],
  },
});

const createSlugFromTitle = <T extends Document>(post: T) => {
  const title = post.enTitle ? post.enTitle.toLowerCase().replace(/ /g, "-") : post.title;

  return encodeURIComponent(title);
};
