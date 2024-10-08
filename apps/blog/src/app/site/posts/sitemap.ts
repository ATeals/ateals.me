import { DocumentBuilder } from "@/service/mdx";
import { DOCUMENT_TYPES } from "@/service/mdx/post";
import { MetadataRoute } from "next";
import { domain } from "../sitemap";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const posts = new DocumentBuilder().getDocuments().filter((post) => post.type !== DOCUMENT_TYPES.LINK);

  const sitemaps: MetadataRoute.Sitemap = [
    ...posts.map(
      (post) =>
        ({
          url: `${domain}${post.url}`,
          lastModified: post.date,
          changeFrequency: "daily",
          priority: 1,
        }) as const
    ),
  ];

  return sitemaps;
};

export default sitemap;
