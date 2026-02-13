"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "system" | "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = "m3_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("system");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(THEME_KEY) as Theme | null;
        if (stored) setThemeState(stored);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const root = document.documentElement;
        if (theme === "system") {
            root.removeAttribute("data-theme");
        } else {
            root.setAttribute("data-theme", theme);
        }
        localStorage.setItem(THEME_KEY, theme);
    }, [theme, mounted]);

    const setTheme = (t: Theme) => setThemeState(t);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
}
