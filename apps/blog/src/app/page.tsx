import { DocumentBuilder } from "@/service/mdx";
import { Header } from "@/widgets/Header";
import { PostTypeList } from "@/widgets/PostTypeList";
import { SocialLinkSection } from "@/widgets/SocialLinkSection";
import { PostList } from "@/widgets/posts/PostList";

import { Separator } from "@repo/shadcn/components";

export default function Home() {
  const posts = new DocumentBuilder().getDocuments().slice(0, 5);

  return (
    <div className="  mx-auto max-w-xl py-8 pt-20 text-gray-700 dark:text-gray-300 px-2">
      <Header className="">
        <p>글 읽는 것을 좋아합니다. 글을 수집하는 것에서 멈추지 않고 작성하려 합니다.</p>
        <p>코드를 즐기며, 커피를 좋아합니다.</p>
      </Header>

      <section className="animate-[fadeInDown_0.5s_200ms_forwards] opacity-0">
        <SocialLinkSection />

        <Separator className="my-8" />

        <PostTypeList />

        <Separator className="my-8" />
      </section>

      <section className="animate-[fadeInDown_0.5s_500ms_forwards] opacity-0">
        <h1 className="mb-10">최신 포스트</h1>
        <PostList posts={posts} className=" font-extralight" />
      </section>
    </div>
  );
}
