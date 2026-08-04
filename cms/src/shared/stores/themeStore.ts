import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "light" | "dark" | "system";

type ThemeState = {
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  setMode: (mode: ThemeMode) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "light",
      primaryColor: "#7B2FF7",
      secondaryColor: "#12C7B7",
      setMode: (mode) => set({ mode }),
      setPrimaryColor: (primaryColor) => set({ primaryColor }),
      setSecondaryColor: (secondaryColor) => set({ secondaryColor }),
    }),
    { name: "bloomar-cms-theme" }
  )
);

export function applyThemeToDocument(state: ThemeState) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = state.mode === "dark" || (state.mode === "system" && prefersDark);
  root.classList.toggle("dark", isDark);
  root.style.setProperty("--color-primary", state.primaryColor);
  root.style.setProperty("--color-secondary", state.secondaryColor);
}
