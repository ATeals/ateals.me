import { SITE_CONFIG } from "@/config";
import { DocumentBuilder } from "@/service/mdx";
import { Feed } from "feed";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params: { feedProtocol } }: { params: { feedProtocol: string } }
) => {
  const posts = new DocumentBuilder().getDocuments();

  const feed = new Feed({
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    id: SITE_CONFIG.domain,
    language: "ko",
    image: `${SITE_CONFIG.domain}images/main.jpg`,
    favicon: `${SITE_CONFIG.domain}favicon.ico`,
    copyright: `All rights reserved since ${SITE_CONFIG.since}, ${SITE_CONFIG.owner.name}`,
    author: SITE_CONFIG.owner,
    generator: "generate-rss",
    link: SITE_CONFIG.domain,
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: post._id,
      link: `${SITE_CONFIG.domain}${post.url}`,
      description: post.body.raw,
      author: [SITE_CONFIG.owner],
      contributor: [SITE_CONFIG.owner],
      image: `${SITE_CONFIG.domain}/${SITE_CONFIG.MAIN_JPG}`,
      date: new Date(post.date),
      category: post.tags?.map((tag) => ({ name: tag })),
    });
  });

  feed.addCategory("Technologies");

  if (feedProtocol === "rss")
    return new Response(feed.rss2(), { headers: { "Content-Type": "text/xml" } });
  else if (feedProtocol === "json")
    return new Response(feed.json1(), { headers: { "Content-Type": "application/json" } });
  else if (feedProtocol === "atom")
    return new Response(feed.atom1(), { headers: { "Content-Type": "text/xml" } });
  else return NextResponse.json({ error: "Invalid feed property" }, { status: 404 });
};
