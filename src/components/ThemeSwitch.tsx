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
          <Button size={"sm"} variant={"outline"}>
            {theme}
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
