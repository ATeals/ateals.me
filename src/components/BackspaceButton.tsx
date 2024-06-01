"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "./shadcn/ui/button";

import { IoReturnDownBack } from "react-icons/io5";

interface BackspaceButtonProps extends ButtonProps {}

export const BackspaceButton = ({ ...props }: BackspaceButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <Button {...props} onClick={handleClick}>
      <IoReturnDownBack className="pr-2" size="20" /> Back
    </Button>
  );
};
