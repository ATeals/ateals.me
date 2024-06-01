import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { Giscus } from "@/components/Giscus";

import Link from "next/link";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { Toc } from "@/components/Toc";
import { MainPostComponent } from "@/widgets/posts/MainPostComponent";
import { getPostByParams } from "@/service/mdx/post";

import { PostBody } from "@/widgets/posts/PostBody";
import { SideMenu } from "@/widgets/SideMenu";
import { BackspaceButton } from "@/components/BackspaceButton";

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath.split("/") }));

export const generateMetadata = ({ params }: { params: { slug: string[] } }) => {
  const post = getPostByParams("/posts/" + params.slug.join("/"));

  if (!post) return { title: "Post not found" };

  return { title: post.title, openGraph: { title: post.title } };
};

const PostLayout = ({ params }: { params: { slug: string[] } }) => {
  const post = getPostByParams("/posts/" + params.slug.join("/"));

  if (!post) notFound();

  return (
    <section className="py-2 md:py-8 mx-auto max-w-xl">
      <article className="relative md:-mt-[500px]">
        <SideMenu>
          <BackspaceButton variant={"ghost"} />
          <Toc post={post} />

          <ThemeSwitch />
        </SideMenu>

        <MainPostComponent post={post}>
          <PostBody post={post} />
        </MainPostComponent>
      </article>
      <Giscus classname="my-10" />
    </section>
  );
};

export default PostLayout;
