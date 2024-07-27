import { HTMLProps } from "react";
import { usePostContext } from "./PostProvider";
import Link from "next/link";

export const PostLink = ({ ...props }: HTMLProps<HTMLAnchorElement>) => {
  const post = usePostContext();

  return post.type === "link" ? (
    <Link href={post.url} target="_black" {...props}>
      {props.children}
    </Link>
  ) : (
    <Link href={post.url} {...props}>
      {props.children}
    </Link>
  );
};
