import { Separator } from "@/components/ui";
import { POST_TYPES, POST_TYPES_ENTITY } from "@/config";
import { DocumentBuilder } from "@/service/mdx";
import { DOCUMENT_TYPES, DocumentType } from "@/service/mdx/post";
import { Header } from "@/widgets/Header";
import { PostsTypeToggle } from "@/widgets/posts/PostsTypeToggle";
import { PostViewTypeToggle } from "@/widgets/posts/PostsViewTypeToggle";
import { TogglePostList } from "@/widgets/posts/TogglePostList";
import { SideMenu } from "@/widgets/SideMenu";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "Posts | Ateals",
    description: "블로그 포스트 목록",
  };
};

export default function Page({
  searchParams,
}: {
  searchParams: { type?: DocumentType; src?: string; tags?: string; view?: string; order?: "desc" | "asc" };
}) {
  const query = { ...searchParams, tags: searchParams.tags?.split(",") || [] };

  const posts = new DocumentBuilder().query(query).getDocuments({ filter: [...Object.values(DOCUMENT_TYPES)] });

  return (
    <div className="mx-auto max-w-2xl py-8 pt-20 text-gray-700 dark:text-gray-300 px-2">
      <Header>
        <p>{getPostsDescription(query.type)}</p>
        <div className="flex justify-between items-center w-full my-4">
          <PostsTypeToggle />
          <PostViewTypeToggle />
        </div>
      </Header>
      <Separator />

      <SideMenu className="hidden lg:block pt-40" />

      <TogglePostList posts={posts} />
    </div>
  );
}

const getPostsDescription = (type?: DocumentType) => {
  if (!type) return POST_TYPES_ENTITY[""].description;

  return POST_TYPES.find((postType) => postType.type === type)?.description;
};
