import { cn } from "@repo/shadcn/utils";
import { HTMLProps } from "react";

interface SideMenuProps extends HTMLProps<HTMLElement> {
  position?: keyof typeof POSITIONS_MAP;
}

const POSITIONS_MAP = {
  left: "text-end -translate-x-[100%] pr-20",
  right: "text-start translate-x-[200%] pl-10",
};

export const SideMenu = ({ position = "left", ...props }: SideMenuProps) => {
  const tailwind = cn(
    "text-sm lg:block hidden sticky w-[300px] top-20",
    "text-gray-700 dark:text-gray-400 font-[350] ",
    POSITIONS_MAP[position]
  );

  return <aside className={tailwind}>{props.children}</aside>;
};

<aside
  className="text-sm lg:block justify-end hidden sticky
 translate-x-[200%] w-[300px] 
  text-gray-700 dark:text-gray-400 font-[350] top-1/4 pr-20"
></aside>;
