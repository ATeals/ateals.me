"use client";

import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

export const OPEN_CMDK_EVENT = "open-cmdk";

export const useCmdK = (onKeyDown: () => unknown) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onKeyDown();
    }
  };

  useEffect(() => {
    document.addEventListener(OPEN_CMDK_EVENT, onKeyDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener(OPEN_CMDK_EVENT, onKeyDown);
    };
  }, []);
};

interface CMDContextType {
  isOpen?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export const CMDContext = createContext<CMDContextType>({});

export const CMDProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setOpen] = useState(false);

  return <CMDContext.Provider value={{ isOpen, setOpen }}>{children}</CMDContext.Provider>;
};

export const useOpenCmd = () => {
  const { isOpen, setOpen } = useContext(CMDContext);

  if (setOpen === undefined || isOpen === undefined) {
    throw new Error("useOpenCmd must be used within a CMDProvider");
  }

  return { isOpen, setOpen };
};
