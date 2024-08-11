import { HTMLProps } from "react";
import { usePostContext } from "./PostProvider";
import Link from "next/link";
import { DOCUMENT_TYPES } from "@/service/mdx/post";

export const PostLink = ({ ...props }: HTMLProps<HTMLAnchorElement>) => {
  const post = usePostContext();

  return post.type === DOCUMENT_TYPES.LINK ? (
    <Link href={post.url} target="_black" {...props}>
      {props.children}
    </Link>
  ) : (
    <Link href={post.url} {...props}>
      {props.children}
    </Link>
  );
};
