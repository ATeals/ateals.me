import { Separator } from "@/components/ui";
import { POST_TYPES, POST_TYPES_ENTITY } from "@/config";
import { DocumentBuilder } from "@/service/mdx";
import { PostType } from "@/service/mdx/post";
import { Header } from "@/widgets/Header";
import { PostsTypeToggle } from "@/widgets/posts/PostsTypeToggle";
import { PostViewTypeToggle } from "@/widgets/posts/PostsViewTypeToggle";
import { PostThreadTypes } from "@/widgets/posts/PostThreadTypes";
import { TogglePostList } from "@/widgets/posts/TogglePostList";
import { SideTagMenu } from "@/widgets/tags/SideTagMenu";

const getPostsDescription = (type?: PostType) => {
  if (!type) return POST_TYPES_ENTITY[""].description;

  return POST_TYPES.find((postType) => postType.type === type)?.description;
};

export default function Page({
  searchParams,
}: {
  searchParams: { type?: PostType; src?: string; tags?: string; view?: string };
}) {
  const query = { ...searchParams, tags: searchParams.tags?.split(",") || [] };

  const posts = new DocumentBuilder().query(query).getDocuments({ filter: ["link", "post", "docs", "snapshot"] });

  const tags = new DocumentBuilder().getAllTags();

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

      <SideTagMenu tags={tags} className="py-[105px] whitespace-warp" />

      {query.type === "snapshot" ? (
        <PostThreadTypes posts={posts} />
      ) : (
        <TogglePostList posts={posts.filter((post) => post.type !== "snapshot")} />
      )}
    </div>
  );
}
