"use client";

import { TagLabel } from "@/components/Tag";
import { SideMenu } from "../SideMenu";
import { HTMLProps, useState } from "react";
import { cn } from "@/lib/utils";
import { Button, Toggle } from "@/components/ui";

interface SideTagMenuProps extends HTMLProps<HTMLElement> {
  tags: string[];
}

export const SideTagMenu = ({ tags, className, ...props }: SideTagMenuProps) => {
  const [state, setState] = useState(false);

  const tw = cn("", className);

  return (
    <SideMenu className={tw} {...props}>
      <Toggle size={"sm"} onClick={() => setState((state) => !state)}>
        TAGS
      </Toggle>
      {state && (
        <div className="py-5">
          {tags.map((tag) => (
            <TagLabel key={tag} tag={tag} />
          ))}
        </div>
      )}
    </SideMenu>
  );
};
