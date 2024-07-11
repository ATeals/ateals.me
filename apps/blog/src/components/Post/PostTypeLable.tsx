import { POST_TYPES_ENTITY } from "@/config";
import { usePostContext } from "./PostProvider";

export const PostTypeLable = ({ ...props }: React.HTMLProps<HTMLHeadingElement>) => {
  const post = usePostContext();

  return <span {...props}>{POST_TYPES_ENTITY[post.type].icon}</span>;
};
