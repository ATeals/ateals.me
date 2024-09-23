import { SITE_CONFIG } from "@/config";
import { DocumentBuilder } from "@/service/mdx";
import { Metadata } from "next";

export const generateMetadata = ({ params: { postID } }: { params: { postID: string } }): Metadata => {
  const post = new DocumentBuilder().getDocuments().find((post) => post.pageID === postID);

  if (!post) return { title: "Post not found" };

  return {
    title: `${post.title} | Ateals`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [{ url: `${post.image}` }],
    },
    keywords: [...(post.tags || []), "ateals"],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      canonical: `${SITE_CONFIG.domain}${post.url}`,
    },
  };
};
