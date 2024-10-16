import { Document } from "@/service/mdx/post";

export const PostJsonLd = ({ post }: { post: Document }) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    description: post.description,
    image: post.image,
    url: post.url,
    author: {
      "@type": "Person",
      name: "Ateals",
    },
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
};
