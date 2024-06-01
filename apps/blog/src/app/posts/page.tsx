import { Separator } from "@/components/ui";
import { groupPostsByYear } from "@/service/mdx";
import { DocumentBuilder, allPosts } from "@/service/mdx/post";
import { Header } from "@/widgets/Header";
import { YearGroupPostList } from "@/widgets/posts/PostList";

export default function Page({ searchParams }: { searchParams: { type: "docs" | "post" } }) {
  const posts = new DocumentBuilder().query({ type: searchParams["type"] }).getDocuments();

  const groupedPosts = groupPostsByYear(posts);

  console.log(
    searchParams["type"],
    posts.map((post) => post.title)
  );

  return (
    <div className="mx-auto max-w-xl py-8 pt-40 text-gray-700 dark:text-gray-300">
      <Header title="Ateals">
        <p>기술 블로그</p>
      </Header>

      <Separator />

      <YearGroupPostList groups={groupedPosts} className="mt-10" />
    </div>
  );
}
