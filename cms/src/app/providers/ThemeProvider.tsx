import { type ReactNode, useEffect } from "react";
import { applyThemeToDocument, useThemeStore } from "@/shared/stores/themeStore";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore();

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme.mode, theme.primaryColor, theme.secondaryColor]);

  return <>{children}</>;
}
