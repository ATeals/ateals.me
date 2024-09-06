import { CommandItem } from "@/components/Command/CommandItem";
import { DocumentBuilder } from "@/service/mdx";
import { Command } from "cmdk";
import { PostItem } from "./PostItem";
import { useRouter } from "next/navigation";

const RecentPost = new DocumentBuilder().getAll();

export const RecentPostGroup = ({ onSelect }: { onSelect?: () => unknown }) => {
  const router = useRouter();

  return (
    <Command.Group heading="Recent Posts">
      {RecentPost.slice(0, 10).map((post) => (
        <CommandItem
          key={post._id}
          onSelect={() => {
            router.push(`${post.url}`);
            onSelect?.();
          }}
        >
          <PostItem post={post} />
        </CommandItem>
      ))}
    </Command.Group>
  );
};
