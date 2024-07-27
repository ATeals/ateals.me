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
  new DocumentBuilder().getDocuments().map((post) => ({ slug: post.pageID }));

const PostLayout = ({ params: { postID } }: { params: { postID: string } }) => {
  const post = new DocumentBuilder().getDocuments().find((post) => post.pageID === postID);

  if (!post) notFound();

  return (
    <section className="mx-auto max-w-xl py-8 pt-20">
      <SideMenu>
        <BackspaceButton variant={"ghost"} />
        <Toc post={post} />

        <ThemeSwitch />
      </SideMenu>

      <MainPostComponent post={post}>
        <PostBody post={post} className="animate-fadeInDown" />
      </MainPostComponent>

      <Giscus classname="my-10 px-2" />
    </section>
  );
};

export default PostLayout;
