import { Separator } from "@/components/ui";
import { POST_TYPES } from "@/config";
import { groupPostsByYear } from "@/service/mdx";
import { DocumentBuilder } from "@/service/mdx";
import { Header } from "@/widgets/Header";
import { YearGroupPostList } from "@/widgets/posts/PostList";
import { PostsToggle } from "@/widgets/posts/PostsToggle";

type PostType = "post" | "docs";

const getPostsDescription = (type?: PostType) => {
  if (!type) return "모든 포스트.";

  return POST_TYPES.find((postType) => postType.type === type)?.description;
};

export default function Page({
  searchParams,
}: {
  searchParams: { type?: PostType; section?: string; tags?: string };
}) {
  const query = { ...searchParams, tags: searchParams.tags?.split(",") || [] };

  const posts = new DocumentBuilder().query(query).getDocuments();

  const groupedPosts = groupPostsByYear(posts);

  return (
    <div className="mx-auto max-w-xl py-8 pt-40 text-gray-700 dark:text-gray-300 px-2 animate-fadeInDown">
      <Header>
        <p>{getPostsDescription(query.type)}</p>
        <PostsToggle type={query.type} />
      </Header>

      <Separator />

      <YearGroupPostList groups={groupedPosts} className="mt-10 font-extralight" />
    </div>
  );
}
