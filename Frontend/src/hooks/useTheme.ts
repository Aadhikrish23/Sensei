import { useEffect, useState } from "react";

type Theme = "samurai" | "ninja";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "samurai";
    }
    return "samurai";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "ninja") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "samurai" ? "ninja" : "samurai"));
  };

  return { theme, toggleTheme };
}