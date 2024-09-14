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

    return NextResponse.redirect(`${SITE_CONFIG.domain}/${post.url}`);
  }

  const post = new DocumentBuilder().query({ type: type as any }).getDocuments()[index];

  return NextResponse.redirect(`${SITE_CONFIG.domain}/${post.url}`);
};
