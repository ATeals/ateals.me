"use client";

import { HTMLProps } from "react";
import { usePostContext } from "./PostProvider";
import readingTime from "reading-time";
import { cn } from "@/lib/utils";

import { CiClock2 } from "react-icons/ci";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui";

export const PostReadingTime = ({ className, ...props }: HTMLProps<HTMLSpanElement>) => {
  const post = usePostContext();

  const tw = cn("text-gray-400 text-sm flex items-center gap-1", className);

  const state = readingTime(post.body.raw);

  const minutes = Math.round(state.minutes);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span className={tw}>
            {minutes} <CiClock2 />
          </span>
        </TooltipTrigger>
        <TooltipContent>글을 읽는 데 최소 {minutes}분이 소요됩니다.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
