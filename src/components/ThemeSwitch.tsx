"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./shadcn/ui/dropdown-menu";
import { Button } from "./shadcn/ui/button";

import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { CiLight, CiDark } from "react-icons/ci";

const THEME_ICON_MAP = {
  light: <CiLight size={"20"} />,
  dark: <CiDark size={"20"} />,
  system: <HiOutlineComputerDesktop size={"20"} />,
};

export const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const [isMount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!isMount) {
    return null;
  }

  return (
    <div suppressHydrationWarning>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"sm"} variant={"ghost"}>
            {theme && THEME_ICON_MAP[theme as keyof typeof THEME_ICON_MAP]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setTheme("light")}>light</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>dark</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>system</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
