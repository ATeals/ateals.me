"use client";

import { Fragment, HTMLProps } from "react";
import { PostsGroupedByYear } from "@/service/mdx/groupPostsByYear";

import { Post } from "@/components/Post";

import Link from "next/link";
import { Separator } from "@repo/shadcn/components";
import { Document } from "@/service/mdx/post";
import { POST_TYPES_ENTITY } from "@/config";

interface PostListProps extends HTMLProps<HTMLDivElement> {
  posts: Document[];
}

export const PostList = ({ posts, ...props }: PostListProps) => {
  return (
    <div {...props}>
      {posts.map((post, idx) => (
        <Post.Provider key={idx} post={post}>
          <Link href={post.url}>
            <div className="flex justify-between my-2">
              <Post.HighLight className="">
                <Post.Title />
              </Post.HighLight>
              <Post.HighLight className="w-1/5">
                <div>
                  {POST_TYPES_ENTITY[post.type].icon}
                  <Post.DATELABLE dateType="DOT" className="ml-2" />
                </div>
              </Post.HighLight>
            </div>
          </Link>
        </Post.Provider>
      ))}
    </div>
  );
};

interface YearGroupPostListProps extends HTMLProps<HTMLDivElement> {
  groups: PostsGroupedByYear[];
}

export const YearGroupPostList = ({ groups, ...props }: YearGroupPostListProps) => {
  return (
    <div {...props}>
      {groups.map((group) => (
        <Fragment key={group.year}>
          <div className={"flex gap-5 items-baseline group/year"}>
            <h1 className="group-hover/year:bg-primary-lg group-hover/year:shadow-lg rounded-lg px-1 group-hover/year:text-gray-100">
              {group.year}
            </h1>
            <div className="w-full">
              <PostList posts={group.posts} />
            </div>
          </div>
          <Separator className="my-5" />
        </Fragment>
      ))}
    </div>
  );
};
