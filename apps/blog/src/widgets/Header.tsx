import { ThemeSwitch } from "@/components/ThemeSwitch";

export const Header = ({ title, children }: { title: string; children?: React.ReactNode }) => {
  return (
    <div className="mb-4">
      <div className="flex align-baseline justify-between">
        <h1 className="mb-8 text-lg font-normal text-black dark:text-gray-100">{title}</h1>
        <div>
          <ThemeSwitch />
        </div>
      </div>
      {children}
    </div>
  );
};
