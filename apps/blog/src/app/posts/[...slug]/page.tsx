import { notFound } from "next/navigation";
import { Giscus } from "@/components/Giscus";

import { ThemeSwitch } from "@/components/ThemeSwitch";
import { Toc } from "@/components/Toc";
import { MainPostComponent } from "@/widgets/posts/MainPostComponent";
import { DocumentBuilder, allPosts } from "@/service/mdx/post";

import { PostBody } from "@/widgets/posts/PostBody";
import { SideMenu } from "@/widgets/SideMenu";
import { BackspaceButton } from "@/components/BackspaceButton";

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath.split("/") }));

export { generateMetadata } from "./metadata";

const PostLayout = ({ params }: { params: { slug: string[] } }) => {
  const decodeURL = "/posts/" + params.slug.map(decodeURIComponent).join("/");

  const post = new DocumentBuilder().getPostByParams(decodeURL);

  if (!post) notFound();

  return (
    <section className="py-2 md:py-8 mx-auto max-w-xl">
      <article className="relative lg:-mt-[500px]">
        <SideMenu>
          <BackspaceButton variant={"ghost"} />
          <Toc post={post} />

          <ThemeSwitch />
        </SideMenu>

        <MainPostComponent post={post}>
          <PostBody post={post} />
        </MainPostComponent>
      </article>

      <Giscus classname="my-10 px-2" />
    </section>
  );
};

export default PostLayout;
