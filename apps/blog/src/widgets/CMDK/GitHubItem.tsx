import { CommandItem } from "@/components/Command/CommandItem";
import { SITE_CONFIG } from "@/config";
import { useRouter } from "next/navigation";

import { FaGithub } from "react-icons/fa";

export const GitHubItem = () => {
  const router = useRouter();

  return (
    <CommandItem
      onSelect={() => {
        router.push(SITE_CONFIG.owner.github);
      }}
    >
      <div className="flex justify-between items-center font-normal">
        <span>Go GitHub</span>
        <FaGithub className="text-lg" />
      </div>
    </CommandItem>
  );
};
