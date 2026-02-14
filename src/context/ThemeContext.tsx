"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface Theme {
    id: string;
    name: string;
    primary: string;
    secondary: string;
    accent: string;
}

const themes: Record<string, Theme> = {
    saffron: { id: "saffron", name: "Saffron", primary: "#FF6B35", secondary: "#FFF5F0", accent: "#FFD93D" },
    ocean: { id: "ocean", name: "Ocean Blue", primary: "#0077B6", secondary: "#F0F9FF", accent: "#90E0EF" },
    forest: { id: "forest", name: "Forest Green", primary: "#2D6A4F", secondary: "#F0FDF4", accent: "#95D5B2" },
    midnight: { id: "midnight", name: "Midnight", primary: "#6366F1", secondary: "#F5F3FF", accent: "#A5B4FC" },
    sunset: { id: "sunset", name: "Sunset Gold", primary: "#D97706", secondary: "#FFFBEB", accent: "#FCD34D" },
};

interface ThemeContextType {
    theme: string;
    setTheme: (theme: string) => void;
    themes: typeof themes;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState("saffron");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem("bp-theme") || "saffron";
        setThemeState(savedTheme);
        applyTheme(savedTheme);
    }, []);

    const applyTheme = (themeId: string) => {
        const themeData = themes[themeId];
        if (themeData) {
            document.documentElement.style.setProperty("--saffron", themeData.primary);
            document.documentElement.style.setProperty("--cream", themeData.secondary);
            document.documentElement.style.setProperty("--turmeric", themeData.accent);
        }
    };

    const setTheme = (newTheme: string) => {
        setThemeState(newTheme);
        localStorage.setItem("bp-theme", newTheme);
        applyTheme(newTheme);
    };

    // Prevent flash of default theme
    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
