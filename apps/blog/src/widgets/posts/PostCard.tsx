"use client";

import { Post } from "@/components/Post";
import { cn } from "@/lib/utils";
import { Document } from "@/service/mdx/post";
import { Children, HTMLProps, ReactNode, useEffect, useRef } from "react";

interface PostCardProps extends HTMLProps<HTMLDivElement> {
  post: Document;
}

interface PostCardListProps extends HTMLProps<HTMLDivElement> {
  posts: Document[];
}

export const PostCard = ({ post, className, ...props }: PostCardProps) => {
  const tw = cn("px-[0.125rem] hover:cursor-pointer", className);

  return (
    <div className={tw} {...props}>
      <Post.Provider post={post}>
        <Post.Link className="block ">
          <div className="rounded-lg overflow-hidden hover:border-2 hover:border-primary-sm">
            <Post.Image className="group-hover/post:scale-110 duration-300" />
          </div>
          <div className="px-2 py-1">
            <div className="flex justify-between">
              <Post.Title className="group-hover/post:text-primary-lg text-sm" />
              <Post.TypeLable />
            </div>
            <Post.DATELABLE dateType={"DOT"} className="text-gray-400 text-xs" />
          </div>
        </Post.Link>
      </Post.Provider>
    </div>
  );
};

export const PostCardList = ({ posts, className, ...props }: PostCardListProps) => {
  return (
    <Masonry className="w-full">
      {posts.map((post) => (
        <PostCard post={post} key={post._id} />
      ))}
    </Masonry>
  );
};

interface MasonryProps extends HTMLProps<HTMLDivElement> {
  columnCount?: number;
}

const Masonry = ({ children, columnCount = 2, ...props }: MasonryProps) => {
  const childrenArray = Children.toArray(children);

  const columns = Array.from({ length: columnCount }, (_, index) =>
    childrenArray.filter((_, childIndex) => childIndex % columnCount === index)
  );

  const tw = cn("flex flex-wrap -mx-2", props.className);

  return (
    <div className={tw}>
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="w-full sm:w-1/2 md:w-1/2 px-">
          {column.map((item, itemIndex) => (
            <div key={itemIndex} className="mb-4">
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
