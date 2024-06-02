import { SITE_CONFIG } from "@/config";
import { DocumentBuilder } from "@/service/mdx";
import { MetadataRoute } from "next";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const posts = new DocumentBuilder().getDocuments();

  return posts.map((post) => ({
    url: `${SITE_CONFIG.domain}${post.url}`,
    lastModified: post.date,
  }));
};

export default sitemap;
