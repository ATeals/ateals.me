"use client";

import { Post } from "@/components/Post";
import { Post as PostType } from "contentlayer/generated";
import { DocumentType } from "contentlayer/source-files";
import { HTMLProps } from "react";

interface MainPostComponentProps extends HTMLProps<HTMLDivElement> {
  post: PostType;
}

export const MainPostComponent = ({ post, ...props }: MainPostComponentProps) => {
  return (
    <div {...props}>
      <Post.Provider post={post}>
        <div>
          <div className="w-full h-[320px] mb-2">
            <Post.Image className="object-contain object-left" />
          </div>
          <div className="px-2 md:px-0 mb-8">
            <Post.DATELABLE className="text-gray-500 font-light" />
            <Post.Title className="text-2xl font-semibold" />
          </div>

          {props.children}

          <Post.Navigation className="flex justify-between mt-8" />
        </div>
      </Post.Provider>
    </div>
  );
};
