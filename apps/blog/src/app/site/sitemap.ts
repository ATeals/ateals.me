import { MetadataRoute } from "next";

const domain = "https://blog.ateals.site";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const sitemaps: MetadataRoute.Sitemap = [
    {
      url: domain,
      priority: 1.0,
    },
    {
      url: `${domain}/posts`,
      priority: 0.9,
    },
  ];

  return sitemaps;
};

export default sitemap;
