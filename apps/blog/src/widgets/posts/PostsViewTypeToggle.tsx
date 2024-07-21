"use client";

import {
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { useQueryParams } from "@/hooks/useQueryParams";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Fragment, HTMLProps } from "react";
import { VIEW_TYPES, VIEW_TYPES_LIST } from "./const";

interface PostsToggleProps extends HTMLProps<HTMLDivElement> {
  type?: keyof typeof VIEW_TYPES;
}

export const PostViewTypeToggle = ({}: PostsToggleProps) => {
  const [getQueryParam, generateQueryParams] = useQueryParams();

  const currentType = getQueryParam("view") || "LIST";

  return (
    <div className="flex h-6 items-center">
      <TooltipProvider>
        {VIEW_TYPES_LIST.map(({ type, name, icon }, index) => (
          <Tooltip key={type}>
            {index !== 0 && <Separator className="mx-2" orientation="vertical" />}

            <TooltipTrigger>
              <Fragment>
                {index !== 0 && <Separator className="mx-2" orientation="vertical" />}
                <Link
                  replace
                  href={`posts?${generateQueryParams(["view", type])}`}
                  className={cn(type === currentType && "text-secondary-md")}
                >
                  {icon}
                </Link>
              </Fragment>
            </TooltipTrigger>
            <TooltipContent>
              <span>{name}</span>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};
