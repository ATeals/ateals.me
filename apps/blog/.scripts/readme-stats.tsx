import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import * as puppeteerLocal from "puppeteer";

import { allDocuments } from "../.contentlayer/generated/index.mjs";
import ReactDOMServer from "react-dom/server";

import React from "react";

const posts = allDocuments.sort((a, b) => (a.date > b.date ? -1 : 1));

const recentPosts = [
  posts.filter((post) => post.type === "Blog")[0],
  posts.filter((post) => post.type === "Docs")[0],
  posts.filter((post) => post.type === "Snapshot")[0],
];

const getBlowser = async () => {
  const isDev = process.env.VERCEL_ENV === "production" ? false : true;

  if (isDev) return await puppeteerLocal.launch();

  const executablePath = await chromium.executablePath;

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: true,
  });

  return browser as any as puppeteerLocal.Browser;
};

const makeImage = async ({ post }: { index: number; post: any }) => {
  const browser = await getBlowser();

  const page = await browser.newPage();

  const componentHtml = ReactDOMServer.renderToString(<PostThumbnail post={post} />);

  const htmlContent = `
    <html>
      <body>
        ${componentHtml}
      </body>
    </html>
  `;

  await page.setContent(htmlContent);

  const clip = await page.evaluate(() => {
    const element = document.querySelector("#app");
    const { x, y, width, height } = element!.getBoundingClientRect();
    return { x, y, width, height };
  });

  await page.screenshot({ path: `./public/readme-stats/${post.type.toLowerCase()}.webp`, clip });
  await browser.close();

  console.log(`✅ ${post.title} image generated`);
};

Promise.all(recentPosts.slice(0, 3).map((post, index) => makeImage({ index, post }))).catch(console.error);

const PostThumbnail = ({ post }: { post: any }) => {
  return (
    <div
      id="app"
      style={{
        width: "300px",
        backgroundColor: "#fff",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s",
      }}
    >
      {/* 이미지 영역 */}
      <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
        <img src={post.image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {/* 날짜 표시 */}
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
      <div style={{ padding: "15px" }}>
        {/* 카테고리 */}
        <span style={{ color: "#5876A2", fontWeight: "bold", fontSize: "12px" }}>
          {" "}
          {new Date(post.date).toLocaleString("ko-kr", { day: "numeric", month: "short" })}
        </span>
        {/* 제목 */}
        <h2 style={{ fontSize: "18px", margin: "10px 0", lineHeight: "1.2" }}>{post.title}</h2>
        {/* 설명 */}
        <p style={{ color: "#757575", fontSize: "14px", margin: "10px 0" }}>{post.description}</p>
        {/* 읽기 시간 및 댓글 수 */}
        <div style={{ display: "flex", gap: "1rem", fontSize: "12px", color: "#9E9E9E" }}>
          {post.tags.map((tag: string) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
