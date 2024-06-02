import { SOCIAL_LINKS } from "@/config";

import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/shadcn/components";

export const SocialLinkSection = () => {
  return (
    <section className="flex gap-2">
      <TooltipProvider>
        {SOCIAL_LINKS.map(({ url, Icon, name }) => (
          <Link href={url} key={name}>
            <Tooltip>
              <TooltipTrigger>
                <Icon />
              </TooltipTrigger>
              <TooltipContent>{name}</TooltipContent>
            </Tooltip>
          </Link>
        ))}
      </TooltipProvider>
    </section>
  );
};
