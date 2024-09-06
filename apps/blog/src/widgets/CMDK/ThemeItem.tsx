import { CommandItem } from "@/components/Command/CommandItem";
import { useTheme } from "@/hooks/useTheme";

export const ThemeItem = ({ onSelect }: { onSelect?: () => unknown }) => {
  const { icon, setNextTheme } = useTheme();

  return (
    <CommandItem
      onSelect={() => {
        setNextTheme();
        onSelect?.();
      }}
    >
      <div className="flex justify-between items-center font-normal">
        <span>Switch Theme</span>
        <span className="text-sm text-gray-500">{icon}</span>
      </div>
    </CommandItem>
  );
};
