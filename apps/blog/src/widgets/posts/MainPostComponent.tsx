"use client";

import { Post } from "@/components/Post";
import { Document } from "@/service/mdx/post";
import { HTMLProps } from "react";
import { SocialLinkSection } from "../SocialLinkSection";
import Link from "next/link";

interface MainPostComponentProps extends HTMLProps<HTMLDivElement> {
  post: Document;
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
            <Post.TagList />
          </div>

          <Post.Author className="flex justify-between gap-5 px-2 md:px-0 my-10">
            <span>
              post by{" "}
              <Link href={"/"} className="text-secondary-md ">
                Ateals
              </Link>
            </span>
            <SocialLinkSection />
          </Post.Author>

          {props.children}

          <Post.Navigation className="flex justify-between mt-8 px-2 max-w-dvw" />
        </div>
      </Post.Provider>
    </div>
  );
};
