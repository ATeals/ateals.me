import { ThemeSwitch } from "@/components/ThemeSwitch";

export const Header = ({
  title,
  children,
}: {
  title: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <div className="mb-4">
      <div className="flex align-baseline justify-between">
        {title}
        <div>
          <ThemeSwitch />
        </div>
      </div>
      {children}
    </div>
  );
};
