import { cn } from "@/lib/utils";
import { usePostContext } from "./PostProvider";

interface TagListProps extends React.HTMLAttributes<HTMLUListElement> {}

interface TagLabelProps extends React.HTMLAttributes<HTMLLIElement> {}

export const TagLabel = ({ children, className, ...props }: TagLabelProps) => {
  return (
    <li
      className={cn(
        "pr-1 hover:text-secondary-md hover:cursor-pointer dark:text-gray-500",
        className
      )}
      {...props}
    >
      {children}
    </li>
  );
};

export const PostTagList = ({ className, ...props }: TagListProps) => {
  const { tags } = usePostContext();

  return (
    tags && (
      <ul
        className={cn(
          "overflow-scroll flex gap-2 text-sm text-gray-700 font-extralight",
          className
        )}
        {...props}
      >
        {tags.map((tag) => (
          <TagLabel key={tag}>#{tag}</TagLabel>
        ))}
      </ul>
    )
  );
};
