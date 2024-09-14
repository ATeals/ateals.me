import React from "react";

import { allDocuments } from "../.contentlayer/generated/index.mjs";
import { ImageResponse } from "@vercel/og";
import { writeFileSync } from "fs";

const posts = allDocuments.sort((a, b) => (a.date > b.date ? -1 : 1));

const recentPosts = [
  posts.filter((post) => post.type === "Blog")[0],
  posts.filter((post) => post.type === "Docs")[0],
  posts.filter((post) => post.type === "Snapshot")[0],
];

export const PostThumbnail = ({ post, area }: { post: any; area: { width: number; height: number } }) => {
  const imageWidth = area.width;
  const imageHeight = area.height / 2;

  post = {
    ...post,
    image:
      post.image === "https://blog.ateals.me/images/main.webp" ? "https://blog.ateals.me/images/main.jpeg" : post.image,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        overflow: "hidden",
        ...area,
      }}
    >
      {/* 이미지 영역 */}
      <div
        style={{
          position: "relative",
          height: imageHeight,
          width: imageWidth,
          display: "flex",
        }}
      >
        <img src={post.image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

        {/* 카테고리 표시 */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "#FF5722",
            color: "#fff",
            padding: "5px 10px",
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "5px",
          }}
        >
          {post.type.toUpperCase()}
        </div>
      </div>

      {/* 텍스트 영역 */}
      <div
        style={{
          padding: "15px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 날짜 */}
        <span
          style={{
            color: "#5876A2",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          {new Date(post.date).toLocaleString("ko-kr", {
            day: "numeric",
            month: "short",
          })}
        </span>
        {/* 제목 */}
        <h2
          style={{
            fontSize: "18px",
            margin: "10px 0",
            lineHeight: "1.2",
            fontWeight: 600,
          }}
        >
          {post.title}
        </h2>
        {/* 설명 */}
        <p
          style={{
            color: "#757575",
            fontSize: "14px",
            margin: "10px 0",
          }}
        >
          {post.description}
        </p>
        {/* 태그 */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            fontSize: "12px",
            color: "#9E9E9E",
          }}
        >
          {post.tags.map((tag: string) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const makeThumbnail = async (post: any) => {
  const area = { width: 300, height: 400 };

  const imageResponse = new ImageResponse(<PostThumbnail post={post} area={area} />, area);

  writeFileSync(
    `./public/readme-stats/${post.type.toLowerCase()}.webp`,
    Buffer.from(await imageResponse.arrayBuffer())
  );

  console.log("✅ Thumbnail generated", post.title);
};

Promise.all(recentPosts.map(makeThumbnail)).then(() => {
  console.log("✅ All thumbnails generated");
});
