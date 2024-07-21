import { ThemeProvider as Provider } from "next-themes";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <Provider attribute="class" enableSystem defaultTheme="system" themes={["light", "dark", "system"]}>
    {children}
  </Provider>
);
