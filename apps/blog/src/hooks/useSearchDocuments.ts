import { DocumentBuilder } from "@/service/mdx";
import { DOCUMENT_TYPES } from "@/service/mdx/post";
import Fuse from "fuse.js";
import { useState } from "react";

const posts = new DocumentBuilder()
  .getDocuments({ filter: [DOCUMENT_TYPES.BLOG, DOCUMENT_TYPES.DOCS, DOCUMENT_TYPES.LINK, DOCUMENT_TYPES.SNAPSHOT] })
  .map((post) => ({ ...post, searchIndex: post.body.raw.split("\n") }));

const fuse = new Fuse(posts, {
  keys: ["title", "tags", "searchIndex"],
  includeScore: true,
  includeMatches: true,
  threshold: 0.3,
});

export const useSearchDocuments = (input?: string) => {
  const [search, setSearch] = useState(input || "");

  const results = fuse
    .search(search)
    .map((result) => result)
    .sort((a, b) => (new Date(a.item.date) > new Date(b.item.date) ? -1 : 1));

  return { search, setSearch, results };
};
