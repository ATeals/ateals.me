"use client";

import { PostNavigation } from "./PostNavigation";
import { PostImage } from "./PostImage";
import { PostDATELABLE } from "./PostDATELABLE";
import { PostAuthor } from "./PostAuthor";
import { PostTitle } from "./PostTitle";
import { PostHighLight } from "./PostHighLight";
import { PostProvider } from "./PostProvider";
import { PostTagList } from "./PostTagList";
import { PostTypeLable } from "./PostTypeLable";
import { PostLink } from "./PostLink";
import { PostReadingTime } from "./PostReadingTime";

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
    TypeLable: PostTypeLable,
    Link: PostLink,
    ReadingTime: PostReadingTime,
  }
);
