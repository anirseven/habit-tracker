import { useState, useEffect } from "react";

const THEME_KEY = "habit-tracker-theme";
const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Initialize from localStorage or default to light
    const savedTheme = localStorage.getItem(THEME_KEY);
    return savedTheme === THEMES.DARK ? THEMES.DARK : THEMES.LIGHT;
  });

  useEffect(() => {
    // Apply theme to document root
    document.documentElement.setAttribute("data-theme", theme);
    // Persist to localStorage
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT
    );
  };

  const setLightTheme = () => setTheme(THEMES.LIGHT);
  const setDarkTheme = () => setTheme(THEMES.DARK);

  return {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isLight: theme === THEMES.LIGHT,
    isDark: theme === THEMES.DARK,
  };
}

export default useTheme;
