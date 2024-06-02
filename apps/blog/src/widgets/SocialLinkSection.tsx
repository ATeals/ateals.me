import { SOCIAL_LINKS, WEB_LINKS } from "@/config";

import Link from "next/link";
import {
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/shadcn/components";
import { cn } from "@/lib/utils";

export const SocialLinkSection = ({ className }: { className?: string }) => {
  return (
    <section className={cn("flex gap-2", className)}>
      <TooltipProvider>
        {WEB_LINKS.map(({ url, Icon, name }) => (
          <Link href={url} key={name}>
            <Tooltip>
              <TooltipTrigger>{typeof Icon === "string" ? Icon : <Icon />}</TooltipTrigger>
              <TooltipContent>{name}</TooltipContent>
            </Tooltip>
          </Link>
        ))}

        <Separator className="mx-1 h-6" orientation="vertical" />

        {SOCIAL_LINKS.map(({ url, Icon, name }) => (
          <Link href={url} key={name}>
            <Tooltip>
              <TooltipTrigger>{typeof Icon === "string" ? Icon : <Icon />}</TooltipTrigger>
              <TooltipContent>{name}</TooltipContent>
            </Tooltip>
          </Link>
        ))}
      </TooltipProvider>
    </section>
  );
};
