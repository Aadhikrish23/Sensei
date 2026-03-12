import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      title={theme === "samurai" ? "Switch to Ninja Mode" : "Switch to Samurai Mode"}
      onClick={toggleTheme}
      className="
        p-2 rounded-md
    
        hover:scale-105
        transition
      "
    >
      {theme === "samurai" ? (
        // <Moon size={18} />
        <span>🌙</span>
      ) : (
        // <Sun size={18} />
        <span>☀️</span>
      )}
    </button>
  );
}