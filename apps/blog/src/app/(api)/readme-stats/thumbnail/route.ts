import { DocumentBuilder } from "@/service/mdx";
import { NextRequest } from "next/server";

import { ImageResponse } from "@vercel/og";

import { PostThumbnail } from "./PostThumbnail";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  const type = searchParams.get("type") || "Blog";
  const index = parseInt(searchParams.get("index") || "0", 10);
  const title = searchParams.get("title");

  const post = title
    ? new DocumentBuilder().getDocuments().find((post) => post.title === title)
    : new DocumentBuilder().query({ type: type as any }).getDocuments()[index];

  if (!post) return new Response("Not Found", { status: 404 });

  const area = { width: 300, height: 400 };

  return new ImageResponse(PostThumbnail({ post, area }), area);
};
