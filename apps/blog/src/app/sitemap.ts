import { SITE_CONFIG } from "@/config";
import { DocumentBuilder } from "@/service/mdx";
import { DOCUMENT_TYPES } from "@/service/mdx/post";
import { MetadataRoute } from "next";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const posts = new DocumentBuilder().getDocuments().filter((post) => post.type !== DOCUMENT_TYPES.LINK);

  const sitemaps: MetadataRoute.Sitemap = [
    {
      url: SITE_CONFIG.domain,
      priority: 1.0,
    },
    {
      url: `${SITE_CONFIG.domain}/posts`,
      priority: 0.9,
    },
    ...posts.map(
      (post) =>
        ({
          url: `${SITE_CONFIG.domain}${post.url}`,
          lastModified: post.date,
          changeFrequency: "daily",
          priority: 0.8,
        }) as const
    ),
  ];

  return sitemaps;
};

export default sitemap;
