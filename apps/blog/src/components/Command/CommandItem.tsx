import { cn } from "@/lib/utils";
import { Command } from "cmdk";
import { ReactNode } from "react";

export const CommandItem = ({
  onSelect,
  children,
  className,
}: {
  className?: string;
  onSelect?: () => unknown;
  children: ReactNode;
}) => {
  const tw = cn(
    "aria-selected:bg-primary-sm aria-selected:bg-opacity-20 rounded-lg px-3 py-4 font-extralight hover:cursor-pointer",
    className
  );

  return (
    <Command.Item className={tw} onSelect={onSelect}>
      {children}
    </Command.Item>
  );
};
