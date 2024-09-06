import { Post } from "@/components/Post";
import { Document } from "@/service/mdx/post";
import { FuseResult } from "fuse.js";

export const PostItem = ({
  result,
  post,
  currentSearch,
}: {
  post: Document;
  result?: FuseResult<Document>;
  currentSearch?: string;
}) => {
  return (
    <Post.Provider post={post}>
      <div>
        <div className="flex justify-between items-center gap-2 text-md font-normal">
          <div className="flex gap-5">
            <Post.TypeLable />
            <Post.Title />
          </div>
          <Post.TagList className="hidden lg:flex" />
        </div>

        <ul className="text-sm text-gray-500 border-l-2 mx-3 px-5">
          {result &&
            result.matches &&
            result.matches.slice(0, 3).map((match, index) => (
              <li key={index} className="py-1">
                {highlightText(match.value, currentSearch)}
              </li>
            ))}
        </ul>
      </div>
    </Post.Provider>
  );
};

const highlightText = (text?: string, keyword?: string) => {
  if (!text || !keyword) return text;

  const parts = text.split(new RegExp(`(${keyword})`, "gi"));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === keyword?.toLowerCase() ? (
          <span key={index} className=" text-secondary-md font-bold">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};
