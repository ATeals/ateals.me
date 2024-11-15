"use client";

import { Progress } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export const ScrollProgress = ({ className, ...props }: Parameters<typeof Progress>[0]) => {
  const [height, setHeight] = useState(0);

  const listener = () => {
    const scroll = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    setHeight((scroll / height) * 100);
  };

  useEffect(() => {
    window.addEventListener("scroll", listener);
    return () => window.removeEventListener("scroll", listener);
  }, []);

  const tw = cn(
    "fixed bottom-0 top-0 left-0 z-[999] h-1 bg-inherit",
    "[&>.progress-bar]:bg-primary-md [&>.progress-bar]:rounded-lg",
    className
  );

  return <Progress value={height} className={tw} {...props} />;
};
