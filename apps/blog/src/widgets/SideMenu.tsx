import { cn } from "@repo/shadcn/utils";
import { HTMLProps } from "react";
import { createPortal } from "react-dom";

interface SideMenuProps extends HTMLProps<HTMLElement> {
  position?: keyof typeof POSITIONS_MAP;
}

const POSITIONS_MAP = {
  left: "text-end -translate-x-[100%] pr-20",
  right: "text-start translate-x-[200%] pl-10",
};

const SideMenuLabel = "SIDE_MENU";

export const SideMenu = ({ position = "left", className, ...props }: SideMenuProps) => {
  const tailwind = cn(
    "text-sm lg:block hidden fixed w-[300px] top-20 h-[80%] overflow-y-auto",
    "text-gray-700 dark:text-gray-400 font-[350] ",
    POSITIONS_MAP[position],
    className
  );

  return (
    <aside className={tailwind}>
      {props.children}

      <div id={SideMenuLabel} className="mt-10 pb-[10rem]"></div>
    </aside>
  );
};

export const SideMenuPortal = ({ children, portalKey }: { children: React.ReactNode; portalKey?: string }) => {
  return createPortal(children, document.getElementById(SideMenuLabel)!, portalKey);
};
