import { DocumentBuilder, groupPostsByYear } from "@/service/mdx";
import { YearGroupPostList } from "@/widgets/posts/PostList";

export default function Page({ params: { src: srcParams } }: { params: { src: string[] } }) {
  const src = srcParams.map(decodeURI).join("/");

  const posts = new DocumentBuilder().query({ src }).getDocuments();

  const groupedPosts = groupPostsByYear(posts);

  return (
    <div className="mx-auto max-w-xl py-8 pt-40 text-gray-700 dark:text-gray-300">
      <YearGroupPostList groups={groupedPosts} />
    </div>
  );
}
