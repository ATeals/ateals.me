import { Document } from "@/service/mdx/post";
import { YearGroupPostList } from "./PostList";

import { CiGrid42 } from "react-icons/ci";
import { IoMdList } from "react-icons/io";
import { FaListUl } from "react-icons/fa";

import { PostCardList } from "./PostCard";
import { PostThreadTypes } from "./PostThreadTypes";

export const VIEW_TYPES = {
  LIST: {
    name: "list",
    icon: <IoMdList />,
    component: ({ $key, posts }: { $key: string; posts: Document[] }) => (
      <YearGroupPostList key={$key} posts={posts} className="animate-[fadeInDown_0.5s_forwards]" />
    ),
  },
  CARD: {
    name: "card",
    icon: <CiGrid42 />,
    component: ({ $key, posts }: { $key: string; posts: Document[] }) => (
      <PostCardList key={$key} posts={posts} className="animate-[fadeInDown_0.5s_forwards]" />
    ),
  },
  LOG: {
    name: "log",
    icon: <FaListUl />,
    component: ({ $key, posts }: { $key: string; posts: Document[] }) => (
      <PostThreadTypes key={$key} posts={posts} className="animate-[fadeInDown_0.5s_forwards]" />
    ),
  },
};

export const VIEW_TYPES_LIST = Object.entries(VIEW_TYPES).map(([key, value]) => ({
  type: key,
  ...value,
}));
