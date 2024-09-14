import React from "react";

import { allDocuments } from "../.contentlayer/generated/index.mjs";
import { ImageResponse } from "@vercel/og";
import { writeFileSync } from "fs";

import { PostThumbnail } from "../src/app/(api)/readme-stats/thumbnail/PostThumbnail";

const posts = allDocuments.sort((a, b) => (a.date > b.date ? -1 : 1));

const recentPosts = [
  posts.filter((post) => post.type === "Blog")[0],
  posts.filter((post) => post.type === "Docs")[0],
  posts.filter((post) => post.type === "Snapshot")[0],
];

const makeThumbnail = async (post: any) => {
  const area = { width: 300, height: 400 };

  const imageResponse = new ImageResponse(PostThumbnail({ post, area }), area);

  writeFileSync(
    `./public/readme-stats/${post.type.toLowerCase()}.webp`,
    Buffer.from(await imageResponse.arrayBuffer())
  );

  console.log("✅ Thumbnail generated", post.title);
};

Promise.all(recentPosts.map(makeThumbnail)).then(() => {
  console.log("✅ All thumbnails generated");
});
