"use client";

import { Post } from "@/components/Post";
import { Document } from "@/service/mdx/post";
import { HTMLProps } from "react";

export const PreviewPostTooltip = ({ children, post }: HTMLProps<HTMLDivElement> & { post: Document }) => {
  return (
    <Post.Provider post={post}>
      <div>
        <div className="flex gap-5 items-baseline">
          <img src="/images/logo.webp" alt="logo" className="w-10 h-auto rounded-[50%]" />
          <Post.Title />
        </div>

        <div className="w-auto h-full mb-2">
          <Post.Image className="object-contain object-center" />
        </div>
        <div className="flex justify-between mb-5">
          <Post.TagList className="px-2 md:p-0" />
          <Post.ReadingTime />
        </div>

        {children}
      </div>
    </Post.Provider>
  );
};
