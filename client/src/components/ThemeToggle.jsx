import {
  Moon,
  Sun
} from "lucide-react";

import {
  useTheme
} from "../context/ThemeContext";

export default function ThemeToggle() {
  const {
    theme,
    toggleTheme
  } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-xl hover:bg-slate-800"
      title="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun size={19} />
      ) : (
        <Moon size={19} />
      )}
    </button>
  );
}