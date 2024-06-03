import { ReactNode, createContext, useContext } from "react";
import { Slot } from "@repo/shadcn/components";
import { Document } from "@/service/mdx/post";

export const PostContext = createContext<Document | undefined>(undefined);

export const usePostContext = () => {
  const post = useContext(PostContext);

  if (!post) {
    throw new Error("PostContext에 Post가 존재하지 않습니다. PostProvider로 감싸주세요.");
  }

  return post;
};

export const PostProvider = ({ post, children }: { post: Document; children: ReactNode }) => {
  return (
    <PostContext.Provider value={post}>
      <Slot className="group/post">{children}</Slot>
    </PostContext.Provider>
  );
};
