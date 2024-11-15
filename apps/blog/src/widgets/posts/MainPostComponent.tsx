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
              <div className="flex px-2">
                <div className="flex gap-5 items-center">
                  <Link href={"/"}>
                    <img src="/images/logo.webp" alt="logo" className="w-10 h-auto" />
                  </Link>
                  <h1 className=" text-lg font-normal text-black dark:text-gray-100">{post.title}</h1>
                </div>
              </div>
            }
          >
            <div className="w-auto h-full mb-2">
              <Post.Image className="object-contain object-center shadow-lg rounded-lg mb-10" />
            </div>
            <div className="flex justify-between mb-5">
              <Post.TagList className="px-2 md:p-0" />
              <Post.ReadingTime />
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

            <Post.DATELABLE className="font-light text-gray-500 text-md px-2 md:p-0" />
          </Header>

          {props.children}

          <Post.Navigation className="w-full" />
        </div>
      </Post.Provider>
    </div>
  );
};
