import { groupPostsByYear } from "@/service/mdx";
import { DocumentBuilder } from "@/service/mdx";
import { Header } from "@/widgets/Header";
import { YearGroupPostList } from "@/widgets/posts/PostList";

import { Separator } from "@repo/shadcn/components";
import { Metadata } from "next";

export default function Home() {
  const posts = new DocumentBuilder().getDocuments();

  const groupedPosts = groupPostsByYear(posts);

  return (
    <div className="mx-auto max-w-xl py-8 pt-40 text-gray-700 dark:text-gray-300">
      <Header title="Ateals">
        <p>글 읽는 것을 좋아합니다. 글을 수집하는 것에서 멈추지 않고 작성하려 합니다.</p>
      </Header>

      <Separator />

      <YearGroupPostList groups={groupedPosts} className="mt-10" />
    </div>
  );
}
