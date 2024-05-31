import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { Giscus } from "@/components/Giscus";

import Link from "next/link";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { Toc } from "@/components/Toc";
import { MainPostComponent } from "@/widgets/posts/MainPostComponent";
import { getPostByParams } from "@/service/mdx/post";

import { PostBody } from "@/widgets/posts/PostBody";

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath.split("/") }));

export const generateMetadata = ({ params }: { params: { slug: string[] } }) => {
  const post = getPostByParams("/posts" + params.slug.join("/"));

  if (!post) return { title: "Post not found" };

  return { title: post.title, openGraph: { title: post.title } };
};

const PostLayout = ({ params }: { params: { slug: string[] } }) => {
  const post = getPostByParams("/posts" + params.slug.join("/"));

  if (!post) notFound();

  return (
    <section className="py-2 md:py-8 mx-auto max-w-xl">
      <article className="relative md:-mt-[500px]">
        <aside className="text-sm text-end  lg:block justify-end hidden sticky -translate-x-[100%] w-[300px]  text-gray-700 dark:text-gray-400 font-[350] top-1/4 pr-20">
          <Link href={"/"} className="block">
            &larr; Home
          </Link>
          <Toc post={post} />

          <ThemeSwitch />
        </aside>

        <MainPostComponent post={post}>
          <PostBody post={post} />
        </MainPostComponent>
      </article>
      <Giscus classname="my-10" />
    </section>
  );
};

export default PostLayout;
