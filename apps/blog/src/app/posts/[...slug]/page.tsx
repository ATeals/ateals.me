import { notFound } from "next/navigation";
import { Giscus } from "@/components/Giscus";

import { ThemeSwitch } from "@/components/ThemeSwitch";
import { Toc } from "@/components/Toc";
import { MainPostComponent } from "@/widgets/posts/MainPostComponent";
import { DocumentBuilder, allPosts } from "@/service/mdx/post";

import { PostBody } from "@/widgets/posts/PostBody";
import { SideMenu } from "@/widgets/SideMenu";
import { BackspaceButton } from "@/components/BackspaceButton";

export { generateMetadata } from "./metadata";

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath.split("/") }));

const PostLayout = ({ params }: { params: { slug: string[] } }) => {
  const decodeURL = "/posts/" + params.slug.map(decodeURIComponent).join("/");

  const post = new DocumentBuilder().getPostByParams(decodeURL);

  if (!post) notFound();

  return (
    <section className="mx-auto max-w-xl py-8 pt-20">
      <article className="relative lg:-mt-[500px]">
        <SideMenu>
          <BackspaceButton variant={"ghost"} />
          <Toc post={post} />

          <ThemeSwitch />
        </SideMenu>

        <MainPostComponent post={post}>
          <PostBody post={post} className="animate-fadeInDown" />
        </MainPostComponent>
      </article>

      <Giscus classname="my-10 px-2" />
    </section>
  );
};

export default PostLayout;
