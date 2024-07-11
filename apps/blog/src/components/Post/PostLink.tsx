import { HTMLProps } from "react";
import { usePostContext } from "./PostProvider";
import Link from "next/link";

export const PostLink = ({ ...props }: HTMLProps<HTMLAnchorElement>) => {
  const post = usePostContext();

  return (
    <Link href={post.url} {...props}>
      {props.children}
    </Link>
  );
};
