import { SITE_CONFIG } from "@/config";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/private/", "/readme-stats/"],
    },
    sitemap: [`${SITE_CONFIG.domain}/sitemap.xml`, `${SITE_CONFIG.domain}/posts/sitemap.xml`],
  };
}
