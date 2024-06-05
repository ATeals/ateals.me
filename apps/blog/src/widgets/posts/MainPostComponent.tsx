"use client";

import { Post } from "@/components/Post";
import { Document } from "@/service/mdx/post";
import { HTMLProps } from "react";
import { SocialLinkSection } from "../SocialLinkSection";
import Link from "next/link";
import { Header } from "../Header";

interface MainPostComponentProps extends HTMLProps<HTMLDivElement> {
  post: Document;
}

export const MainPostComponent = ({ post, ...props }: MainPostComponentProps) => {
  return (
    <div {...props}>
      <Post.Provider post={post}>
        <div>
          <Header
            title={
              <div className="flex">
                <div className="flex gap-5 items-center">
                  <img src="/images/logo.webp" alt="logo" className="w-10 h-auto" />
                  <h1 className=" text-lg font-normal text-black dark:text-gray-100">
                    {post.title}
                  </h1>
                </div>
              </div>
            }
          >
            <div className="w-full h-[320px] my-5">
              <Post.Image className="object-contain object-center" />
            </div>

            <Post.Author className="flex justify-between gap-5 px-2 md:px-0">
              <span>
                post by{" "}
                <Link href={"/"} className="text-secondary-md ">
                  Ateals
                </Link>
              </span>
              <SocialLinkSection />
            </Post.Author>

            <Post.DATELABLE className="font-light text-gray-500 text-md" />
            <Post.TagList />
          </Header>

          {props.children}

          <Post.Navigation className="flex justify-between mt-8 px-2 max-w-dvw" />
        </div>
      </Post.Provider>
    </div>
  );
};
