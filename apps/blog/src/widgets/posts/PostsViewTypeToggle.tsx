"use client";

import { Separator, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui";
import { useQueryParams } from "@/hooks/useQueryParams";
import { cn } from "@/lib/utils";
import { Fragment, HTMLProps } from "react";
import { VIEW_TYPES, VIEW_TYPES_LIST } from "./const";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface PostsToggleProps extends HTMLProps<HTMLDivElement> {
  type?: keyof typeof VIEW_TYPES;
}

export const PostViewTypeToggle = ({}: PostsToggleProps) => {
  const [storage, setStorage] = useLocalStorage("viewType", { initialValue: "LIST" });

  const query = useQueryParams();

  const currentType = query.get("view") || storage;

  const handleClick = (type: string) => {
    setStorage(type);
    query.set("replace", query.stringify(["view", type]));
  };

  return (
    <div className="flex h-6 items-center">
      <TooltipProvider>
        {VIEW_TYPES_LIST.map(({ type, name, icon }, index) => (
          <Tooltip key={type}>
            {index !== 0 && <Separator className="mx-2" orientation="vertical" />}

            <TooltipTrigger onClick={() => handleClick(type)}>
              <Fragment>
                {index !== 0 && <Separator className="mx-2" orientation="vertical" />}
                <span className={cn(type === currentType && "text-secondary-md")}>{icon}</span>
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
