import { allPosts } from "contentlayer/generated";

import { notFound } from "next/navigation";

import { getMDXComponent } from "next-contentlayer/hooks";

import { MDXWapper } from "@/components/MDXWapper";
import { Giscus } from "@/components/Giscus";

import "@/styles/callout.css";
import Link from "next/link";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { Toc } from "@/components/Toc";
import { MainPostComponent } from "@/widgets/posts/MainPostComponent";
import { getPostByParams } from "@/service/mdx/post";

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post.url.split("/") }));

export const generateMetadata = ({ params }: { params: { slug: string[] } }) => {
  const post = getPostByParams("/posts/" + params.slug.join("/"));

  if (!post) return { title: "Post not found" };

  return { title: post.title, openGraph: { title: post.title } };
};

const PostLayout = ({ params }: { params: { slug: string[] } }) => {
  const post = getPostByParams("/posts/" + params.slug.join("/"));

  if (!post) notFound();

  const MDXComponent = getMDXComponent(post.body.code);

  return (
    <article className="py-2 md:py-8 mx-auto max-w-xl">
      <aside className="text-sm text-end  lg:block justify-end hidden fixed -translate-x-[100%] w-[300px]  text-gray-700 dark:text-gray-400 font-[350] top-1/4 pr-20">
        <Link href={"/"} className="block">
          &larr; Home
        </Link>
        <Toc post={post} />

        <ThemeSwitch />
      </aside>

      <MainPostComponent post={post}>
        <MDXWapper>
          <MDXComponent
            components={{
              h1: HeadingComponents("h1"),
              h2: HeadingComponents("h2"),
              h3: HeadingComponents("h3"),
            }}
          />
        </MDXWapper>
      </MainPostComponent>

      <Giscus classname="my-10" />
    </article>
  );
};

const HeadingComponents =
  (type: "h1" | "h2" | "h3") =>
  ({ ...props }) => {
    const Element = type;

    return <Element {...props} id={typeof props.children === "string" ? props.children : ""} />;
  };

export default PostLayout;
