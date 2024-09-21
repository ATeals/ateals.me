import { SITE_CONFIG } from "@/config";
import { DocumentBuilder } from "@/service/mdx";
import { DOCUMENT_TYPES } from "@/service/mdx/post";
import { MetadataRoute } from "next";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const posts = new DocumentBuilder().getDocuments().filter((post) => post.type !== DOCUMENT_TYPES.LINK);

  const sitemaps: MetadataRoute.Sitemap = [
    ...posts.map(
      (post) =>
        ({
          url: `${SITE_CONFIG.domain}${post.url}`,
          lastModified: post.date,
          changeFrequency: "daily",
          priority: 1,
        }) as const
    ),
  ];

  return sitemaps;
};

export default sitemap;
