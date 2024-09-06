"use client";

import { IoMdSearch } from "react-icons/io";
import { MdKeyboardCommandKey } from "react-icons/md";

import { Button } from "@/components/ui";
import { useOpenCmd } from "@/hooks/useCmdK";

export const OpenCMDKButton = () => {
  const { setOpen } = useOpenCmd();

  const handleClick = () => setOpen((isOpen) => !isOpen);

  return (
    <Button
      onClick={() => handleClick()}
      variant={"ghost"}
      className="text-gray-500 dark:text-gray-400 flex min-w-[200px] justify-between items-center text-md border rounded-md px-2 py-0 h-6"
    >
      <div className="flex gap-1 items-center">
        <IoMdSearch /> <span className="text-sm">Search</span>
      </div>
      <div className="flex items-center text-sm">
        <MdKeyboardCommandKey /> <span>K</span>
      </div>
    </Button>
  );
};
