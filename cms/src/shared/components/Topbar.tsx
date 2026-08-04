import { useThemeStore } from "@/shared/stores/themeStore";

type TopbarProps = {
  title: string;
  subtitle?: string;
};

export function Topbar({ title, subtitle }: TopbarProps) {
  const { mode, setMode } = useThemeStore();

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <div>
        <h1 className="text-lg font-bold text-bloomar-navy dark:text-white">{title}</h1>
        {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-2">
        <button className="btn-secondary" type="button" onClick={toggleTheme} aria-label="Toggle theme">
          {mode === "dark" ? "☀️" : "🌙"}
        </button>
        <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          Sprint 0
        </span>
      </div>
    </header>
  );
}
