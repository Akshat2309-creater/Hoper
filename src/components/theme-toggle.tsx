import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/** Day / night toggle for the nav (next-themes `class` on `<html>`). */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-secondary-foreground outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={isDark ? "Switch to day theme" : "Switch to night theme"}
      disabled={!mounted}
    >
      <Sun
        className={`h-[1.15rem] w-[1.15rem] transition-transform ${
          isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
        aria-hidden
      />
      <Moon
        className={`absolute h-[1.15rem] w-[1.15rem] transition-transform ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
        }`}
        aria-hidden
      />
    </button>
  );
}
