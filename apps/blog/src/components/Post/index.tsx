import { parseISO, format } from "date-fns";
import { createContext, useContext } from "react";

import { Document } from "@/service/mdx/post";
import { PostNavigation } from "./PostNavigation";
import { PostImage } from "./PostImage";
import { PostDATELABLE } from "./PostDATELABLE";
import { PostAuthor } from "./PostAuthor";
import { PostTitle } from "./PostTitle";
import { PostHighLight } from "./PostHighLight";
import { PostProvider } from "./PostProvider";
import { PostTagList } from "./PostTagList";

export const Post = Object.assign(
  {},
  {
    Provider: PostProvider,
    Title: PostTitle,
    DATELABLE: PostDATELABLE,
    HighLight: PostHighLight,
    Image: PostImage,
    Navigation: PostNavigation,
    Author: PostAuthor,
    TagList: PostTagList,
  }
);
