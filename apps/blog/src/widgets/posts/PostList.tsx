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
          <Post.Link>
            <div className="grid grid-cols-10 gap-2 my-2">
              <Post.HighLight className="col-span-7 md:col-span-8">
                <Post.Title />
              </Post.HighLight>
              <div className="col-span-3 md:col-span-2">
                <Post.HighLight className="flex">
                  <div>
                    <Post.TypeLable />
                    <Post.DATELABLE dateType={"DOT_EXCUDE_YEAR"} className="ml-2" />
                  </div>
                </Post.HighLight>
              </div>
            </div>
          </Post.Link>
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
