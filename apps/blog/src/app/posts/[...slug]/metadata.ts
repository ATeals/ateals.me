import { DocumentBuilder } from "@/service/mdx";
import { Metadata } from "next";

export const generateMetadata = ({ params }: { params: { slug: string[] } }): Metadata => {
  const post = new DocumentBuilder().getPostByParams(
    "/posts/" + params.slug.map(decodeURIComponent).join("/")
  );

  if (!post) return { title: "Post not found" };

  return {
    title: `${post.title} | Ateals`,
    description: post.description,
    openGraph: { title: post.title, description: post.description, images: [{ url: post.image }] },
  };
};
