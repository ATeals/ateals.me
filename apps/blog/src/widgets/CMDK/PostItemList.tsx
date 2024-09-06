import { Document } from "@/service/mdx/post";
import { FuseResult } from "fuse.js";
import { useRouter } from "next/navigation";
import { PostItem } from "./PostItem";
import { CommandItem } from "@/components/Command/CommandItem";

export const PostItemList = ({
  results,
  onSelect,
  search,
}: {
  search: string;
  onSelect?: () => unknown;
  results: FuseResult<Document>[];
}) => {
  const router = useRouter();

  return results.map((result) => (
    <CommandItem
      key={result.item._id}
      onSelect={() => {
        router.push(`${result.item.url}`);
        onSelect?.();
      }}
    >
      <PostItem post={result.item} result={result} currentSearch={search} />
    </CommandItem>
  ));
};
