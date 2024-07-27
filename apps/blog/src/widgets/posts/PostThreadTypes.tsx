"use client";

import { Post } from "@/components/Post";
import { cn } from "@/lib/utils";
import { Document } from "@/service/mdx/post";
import { Fragment, HTMLProps } from "react";
import { PostBody } from "./PostBody";
import { Separator } from "@/components/ui";
import Link from "next/link";

interface PostThreadTypesProps extends HTMLProps<HTMLDivElement> {
  posts: Document[];
}

export const PostThreadTypes = ({ posts, className, ...props }: PostThreadTypesProps) => {
  const tw = cn("", className);

  return (
    <div className={tw} {...props}>
      {posts.map((post) => (
        <Fragment key={post._id}>
          <Post.Provider post={post}>
            <div className="py-5">
              <div className="flex justify-between">
                <Link href={post.url}>
                  <Post.Title className="text-lg group-hover/post:text-primary-lg" />
                </Link>

                <Post.TypeLable />
              </div>

              <div className="flex justify-between mb-5 px-1 py-2">
                <Post.TagList className="px-2 md:p-0" />
                <Post.ReadingTime />
              </div>

              <PostBody post={post} />

              <Post.DATELABLE className="font-light text-gray-500 text-md px-2 md:p-0 text-sm" />
            </div>
          </Post.Provider>
          <Separator />
        </Fragment>
      ))}
    </div>
  );
};
