import { SITE_CONFIG } from "@/config";
import { DocumentBuilder } from "@/service/mdx";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get("type") || "Blog";
  const index = parseInt(searchParams.get("index") || "0", 10);

  const title = searchParams.get("title");

  if (title) {
    const post = new DocumentBuilder().getDocuments().find((post) => post.title === title);

    if (!post) {
      return NextResponse.json("Not Found", { status: 404 });
    }

    return new Response(generateSVG(post.title), {
      headers: {
        "Content-Type": "image/svg+xml",
      },
    });
  }

  const post = new DocumentBuilder().query({ type: type as any }).getDocuments()[index];

  return new Response(generateSVG(post.title), {
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });
};

const generateSVG = (text: string) => {
  // 텍스트 길이에 따라 SVG 너비 계산 (대략적인 계산)
  const charWidth = 10; // 각 문자의 대략적인 너비 (픽셀)
  const width = text.length * charWidth + 100;

  // SVG 높이 설정 (고정값)
  const height = 30;

  // 텍스트 위치 설정
  const x = 10;
  const y = 20;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <style>
        text {
          font-family: Arial, sans-serif;
          font-size: 16px;
          fill: #333;
        }
      </style>
      <text x="${x}" y="${y}">
        ${text}
      </text>
    </svg>
  `;
};
