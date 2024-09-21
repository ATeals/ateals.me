import { SITE_CONFIG } from "@/config";
import { MetadataRoute } from "next";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const sitemaps: MetadataRoute.Sitemap = [
    {
      url: SITE_CONFIG.domain,
      priority: 1.0,
    },
    {
      url: `${SITE_CONFIG.domain}/posts`,
      priority: 0.9,
    },
  ];

  return sitemaps;
};

export default sitemap;
