import { useTheme as useNextTheme } from "next-themes";

import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { CiLight, CiDark } from "react-icons/ci";

const NextTheme = {
  light: "dark",
  dark: "system",
  system: "light",
};

const THEME_ICON_MAP = {
  light: <CiLight size={"20"} />,
  dark: <CiDark size={"20"} />,
  system: <HiOutlineComputerDesktop size={"20"} />,
};

export const useTheme = () => {
  const { theme, setTheme: set } = useNextTheme();

  const setTheme = (theme: "light" | "dark" | "system") => set(theme);

  const setNextTheme = () => set(NextTheme[theme as keyof typeof NextTheme]);

  const icon = THEME_ICON_MAP[theme as keyof typeof THEME_ICON_MAP];

  return { theme, setTheme, setNextTheme, icon };
};
