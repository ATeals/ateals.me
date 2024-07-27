"use client";

import { TagLabel } from "@/components/Tag";
import { SideMenu } from "../SideMenu";
import { HTMLProps, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button, Separator, Toggle } from "@/components/ui";
import { useQueryParams } from "@/hooks/useQueryParams";
import Link from "next/link";

interface SideTagMenuProps extends HTMLProps<HTMLElement> {
  tags: string[];
}

export const SideTagMenu = ({ tags, className, ...props }: SideTagMenuProps) => {
  const [getQuery, generateQuery] = useQueryParams();

  const tag = getQuery("tags");

  const [isOpen, setIsOpen] = useState(tag ? true : false);

  const tw = cn("", className);

  return (
    <SideMenu className={tw} {...props}>
      {tag ? (
        <Toggle size={"sm"} asChild>
          <Link href={`posts?${generateQuery(["tags", ""])}`}>CLEAR</Link>
        </Toggle>
      ) : (
        <Toggle size={"sm"} onClick={() => setIsOpen((isOpen) => !isOpen)}>
          TAGS
        </Toggle>
      )}
      {isOpen && (
        <div className="py-5">
          {tags.map((tag) => (
            <TagLabel key={tag} tag={tag} />
          ))}
        </div>
      )}
    </SideMenu>
  );
};
