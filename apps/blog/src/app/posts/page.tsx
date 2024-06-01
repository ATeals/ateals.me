import { Separator } from "@/components/ui";
import { groupPostsByYear } from "@/service/mdx";
import { DocumentBuilder } from "@/service/mdx/post";
import { Header } from "@/widgets/Header";
import { YearGroupPostList } from "@/widgets/posts/PostList";
import { PostsToggle } from "@/widgets/posts/PostsToggle";

export default function Page({
  searchParams,
}: {
  searchParams: { type?: "docs" | "post"; section?: string; tags?: string };
}) {
  const query = { ...searchParams, tags: searchParams.tags?.split(",") || [] };

  const posts = new DocumentBuilder().query(query).getDocuments();

  const groupedPosts = groupPostsByYear(posts);

  return (
    <div className="mx-auto max-w-xl py-8 pt-40 text-gray-700 dark:text-gray-300">
      <Header title="Ateals">
        <p>기술 블로그</p>

        <PostsToggle type={searchParams.type} />
      </Header>

      <Separator />

      <YearGroupPostList groups={groupedPosts} className="mt-10" />
    </div>
  );
}
