import { ThemeSwitch } from "@/components/ThemeSwitch";
import Link from "next/link";

export const Header = ({
  title,
  children,
}: {
  title?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <div className="mb-4">
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
