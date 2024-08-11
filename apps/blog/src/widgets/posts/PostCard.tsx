"use client";

import { Post } from "@/components/Post";
import { cn } from "@/lib/utils";
import { Document } from "@/service/mdx/post";
import { HTMLProps, useEffect, useRef } from "react";

interface PostCardProps extends HTMLProps<HTMLDivElement> {
  post: Document;
}

interface PostCardListProps extends HTMLProps<HTMLDivElement> {
  posts: Document[];
}

export const PostCard = ({ post, className, ...props }: PostCardProps) => {
  const tw = cn("px-[0.125rem] hover:cursor-pointer", className);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const item = ref.current;

    if (!item) return;

    item.style.gridRowEnd = `span ${item.clientHeight}`;
  }, [ref.current]);

  return (
    <div ref={ref} className={tw} {...props}>
      <Post.Provider post={post}>
        <Post.Link className="block">
          <div className="rounded-lg overflow-hidden">
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
  const tw = cn("grid box-border grid-cols-2", className);

  return (
    <div className={tw}>
      {posts.map((post, index) => (
        <PostCard post={post} key={post._id} />
      ))}
    </div>
  );
};
