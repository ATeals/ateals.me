import { Separator } from "@/components/ui";
import { POST_TYPES } from "@/config";
import { DocumentBuilder } from "@/service/mdx";
import { Header } from "@/widgets/Header";
import { YearGroupPostList } from "@/widgets/posts/PostList";
import { PostsTypeToggle } from "@/widgets/posts/PostsTypeToggle";
import { PostViewTypeToggle } from "@/widgets/posts/PostsViewTypeToggle";
import { TogglePostList } from "@/widgets/posts/TogglePostList";

type PostType = "post" | "docs";

const getPostsDescription = (type?: PostType) => {
  if (!type) return "모든 포스트.";

  return POST_TYPES.find((postType) => postType.type === type)?.description;
};

export default function Page({
  searchParams,
}: {
  searchParams: { type?: PostType; src?: string; tags?: string; view?: string };
}) {
  const query = { ...searchParams, tags: searchParams.tags?.split(",") || [] };

  const posts = new DocumentBuilder().query(query).getDocuments();

  return (
    <div className="mx-auto max-w-xl py-8 pt-20 text-gray-700 dark:text-gray-300 px-2">
      <Header>
        <p>{getPostsDescription(query.type)}</p>
        <div className="flex justify-between items-center w-full my-4">
          <PostsTypeToggle />
          <PostViewTypeToggle />
        </div>
      </Header>
      <Separator />

      <TogglePostList posts={posts} />
    </div>
  );
}
