import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const ThemeContext =
  createContext(null);

export function ThemeProvider({
  children
}) {
  const [theme, setTheme] =
    useState(() => {
      return (
        localStorage.getItem(
          "career-planner-theme"
        ) || "dark"
      );
    });

  useEffect(() => {
    document.documentElement.classList.toggle(
      "light",
      theme === "light"
    );

    localStorage.setItem(
      "career-planner-theme",
      theme
    );
  }, [theme]);

  const toggleTheme = () => {
    setTheme((previous) =>
      previous === "dark"
        ? "light"
        : "dark"
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(
    ThemeContext
  );
}