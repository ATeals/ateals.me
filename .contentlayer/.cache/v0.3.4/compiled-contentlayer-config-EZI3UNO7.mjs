// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import remarkCallout from "remark-callout";
import rehypePrettyCode from "rehype-pretty-code";
var fields = {
  title: { type: "string", required: true },
  description: { type: "string", required: true },
  date: { type: "date", required: true },
  image: { type: "string", default: "/images/main.webp" },
  draft: { type: "boolean" },
  tags: { type: "list", of: { type: "string" } }
};
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields,
  computedFields: {
    url: { type: "string", resolve: (post) => `/posts/${post._raw.flattenedPath}` }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "posts",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm, remarkCallout],
    rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]]
  }
});
export {
  Post,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-EZI3UNO7.mjs.map
