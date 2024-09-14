import { DocumentBuilder } from "@/service/mdx";
import { NextRequest } from "next/server";

import puppeteer from "puppeteer";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get("type") || "Blog";

  const index = parseInt(searchParams.get("index") || "0", 10);
  const title = searchParams.get("title");

  if (title) {
    const post = new DocumentBuilder().getDocuments().find((post) => post.title === title);

    if (!post) {
      return new Response("Not Found", { status: 404 });
    }

    return new Response(await makeImage({ post }), {
      headers: {
        "Content-Type": "image/webp",
      },
    });
  }

  const post = new DocumentBuilder().query({ type: type as any }).getDocuments()[index];

  const blob = await makeImage({ post });

  return new Response(blob, {
    headers: {
      "Content-Type": "image/webp",
    },
  });
};

const makeImage = async ({ post }: { post: any }) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const componentHtml = generatePostThumbnailHtml(post);

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

  const screenshotBuffer = await page.screenshot({ clip });

  await browser.close();

  return screenshotBuffer;
};

const generatePostThumbnailHtml = (post: any) => {
  return `
    <div
      id="app"
      style="
        width: 300px;
        background-color: #fff;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s;
      "
    >
      <!-- 이미지 영역 -->
      <div style="position: relative; height: 200px; overflow: hidden;">
        <img src="${post.image}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;" />
        <!-- 날짜 표시 -->
        <div
          style="
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #FF5722;
            color: #fff;
            padding: 5px 10px;
            font-size: 12px;
            font-weight: bold;
            border-radius: 5px;
          "
        >
          ${post.type.toUpperCase()}
        </div>
      </div>

      <!-- 텍스트 영역 -->
      <div style="padding: 15px;">
        <!-- 카테고리 -->
        <span style="color: #5876A2; font-weight: bold; font-size: 12px;">
          ${new Date(post.date).toLocaleString("ko-kr", { day: "numeric", month: "short" })}
        </span>
        <!-- 제목 -->
        <h2 style="font-size: 18px; margin: 10px 0; line-height: 1.2;">${post.title}</h2>
        <!-- 설명 -->
        <p style="color: #757575; font-size: 14px; margin: 10px 0;">${post.description}</p>
        <!-- 읽기 시간 및 댓글 수 -->
        <div style="display: flex; gap: 1rem; font-size: 12px; color: #9E9E9E;">
          ${post.tags.map((tag: string) => `<span>#${tag}</span>`).join("")}
        </div>
      </div>
    </div>
  `;
};
