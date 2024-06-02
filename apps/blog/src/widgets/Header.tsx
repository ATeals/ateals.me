import { ThemeSwitch } from "@/components/ThemeSwitch";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
      <div className="flex align-baseline justify-between">
        {title ? (
          title
        ) : (
          <Link href={"/"} className="flex gap-5 items-center mb-8">
            <img src="/images/logo.webp" alt="logo" className="w-10 h-auto" />
            <h1 className=" text-lg font-normal text-black dark:text-gray-100">Ateals</h1>
          </Link>
        )}
        <div>
          <ThemeSwitch />
        </div>
      </div>
      {children}
    </div>
  );
};
