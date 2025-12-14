"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { defaultTheme } from './tokens';

type Theme = typeof defaultTheme;

const ThemeContext = createContext<{
    theme: Theme;
    setThemeConfig: (config: any) => void;
}>({
    theme: defaultTheme,
    setThemeConfig: () => { },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(defaultTheme);

    const setThemeConfig = (config: any) => {
        // Logic to merge config and update state + CSS vars
        // For now, simpler implementation
        console.log("Setting theme config", config);
    };

    useEffect(() => {
        // Initial sync of CSS variables if needed, though handled by globals.css mostly
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setThemeConfig }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
