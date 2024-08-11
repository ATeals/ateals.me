"use client";

import { Post } from "@/components/Post";
import { cn } from "@/lib/utils";
import { Document, DOCUMENT_TYPES } from "@/service/mdx/post";
import { ButtonHTMLAttributes, HTMLProps, useState } from "react";
import { PostBody } from "./PostBody";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SITE_CONFIG } from "@/config";
import { Separator } from "@/components/ui";

interface PostThreadTypesProps extends HTMLProps<HTMLDivElement> {
  posts: Document[];
}

export const PostThreadTypes = ({ posts, className, ...props }: PostThreadTypesProps) => {
  const tw = cn("", className);

  return (
    <div className={tw} {...props}>
      <Accordion type="multiple">
        {posts.map((post) => (
          <Post.Provider post={post} key={post._id}>
            {post.type === DOCUMENT_TYPES.LINK ? (
              <>
                <Post.Link target="_black" className="py-5 flex gap-2">
                  <Post.TypeLable />
                  <Post.Title className="group-hover/post:text-primary-lg font-extralight" />
                </Post.Link>
                <Separator />
              </>
            ) : (
              <AccordionItem value={post._id}>
                <AccordionTrigger className="">
                  <div className="flex gap-2">
                    <Post.TypeLable />
                    <Post.Title className=" group-hover/post:text-primary-lg font-extralight" />
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex justify-between mb-5 px-1 py-2">
                    <Post.TagList className="px-2 md:p-0" />
                    <Post.ReadingTime />
                  </div>

                  <PostBody post={post} />

                  <div className="flex justify-between align-baseline mb-2 mt-20 px-1 text-gray-500">
                    <div className="flex justify-between align-baseline gap-3">
                      <Post.Link className="underline">원문 보기</Post.Link>
                      <ClipLink url={`${SITE_CONFIG.domain}${post.url}`}>링크 복사</ClipLink>
                    </div>
                    <Post.DATELABLE className="font-light text-md px-2 md:p-0 text-sm" />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Post.Provider>
        ))}
      </Accordion>
    </div>
  );
};

const ClipLink = ({
  children,
  className,
  url,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { url: string }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setIsClicked(true);
  };

  const tw = cn("underline", className);

  return (
    <button onClick={handleCopyLink} className={tw} disabled={isClicked} {...props}>
      {isClicked ? "복사 완료" : children}
    </button>
  );
};
