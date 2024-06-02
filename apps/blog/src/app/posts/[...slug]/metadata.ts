import { DocumentBuilder } from "@/service/mdx";

export const generateMetadata = ({ params }: { params: { slug: string[] } }) => {
  const post = new DocumentBuilder().getPostByParams(
    "/posts/" + params.slug.map(decodeURIComponent).join("/")
  );

  if (!post) return { title: "Post not found" };

  return {
    title: `${post.title} | Ateals`,
    description: post.description,
    openGraph: { title: post.title, description: post.description, image: post.image },
  };
};
