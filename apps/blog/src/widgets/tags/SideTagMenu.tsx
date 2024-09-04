"use client";

import { TagLabel } from "@/components/Tag";
import { SideMenu } from "../SideMenu";
import { cn } from "@/lib/utils";
import { useQueryParams } from "@/hooks/useQueryParams";
import Link from "next/link";
import { Button } from "@/components/ui";
import { HTMLProps, useState } from "react";

interface SideTagMenuProps extends HTMLProps<HTMLElement> {
  tags: string[];
}

export const SideTagMenu = ({ tags, className, ...props }: SideTagMenuProps) => {
  const query = useQueryParams();

  const tag = query.get<string>("tags") || "";

  const [isOpen, setIsOpen] = useState(tag ? true : false);

  const tw = cn("overflow-scroll", className);

  return (
    <SideMenu className={tw} {...props}>
      {tag ? (
        <Button size={"sm"} variant={"link"} asChild>
          <Link href={`posts?${query.stringify(["tags", ""])}`}>CLEAR</Link>
        </Button>
      ) : (
        <Button size={"sm"} variant={"link"} onClick={() => setIsOpen((isOpen) => !isOpen)}>
          TAGS
        </Button>
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
