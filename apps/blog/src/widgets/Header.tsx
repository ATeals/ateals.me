import { ThemeSwitch } from "@/components/ThemeSwitch";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { OpenCMDKButton } from "./CMDK/OpenCMDKButton";

export const Header = ({
  title,
  children,
  className,
}: {
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex align-center justify-between mb-8">
        {title ? (
          title
        ) : (
          <>
            <Link href={"/"} className="flex gap-5 justify-between items-center w-full">
              <div className="flex gap-5 items-center">
                <img src="/images/logo.webp" alt="logo" className="w-10 h-auto" />
                <h1 className=" text-lg font-normal text-black dark:text-gray-100">Ateals</h1>
              </div>
            </Link>

            <div className="flex items-center">
              <OpenCMDKButton />
            </div>
          </>
        )}
      </div>
      {children}
    </div>
  );
};
