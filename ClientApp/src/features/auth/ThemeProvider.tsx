import React, { createContext, useCallback, useEffect, useState } from "react";

interface IThemeContext {
    theme: "dark" | "light";
    toggleTheme: () => void;
    setTheme: React.Dispatch<React.SetStateAction<"dark" | "light">>;
}

const ThemeContext = createContext<IThemeContext>(null!);

const ThemeProvider = ({
    children,
    defaultTheme,
}: React.PropsWithChildren<{ defaultTheme: "dark" | "light" }>) => {
    const [theme, setTheme] = useState<"dark" | "light">(() => {
        const localTheme = localStorage.getItem("theme");
        if (localTheme) {
            return localTheme as "dark" | "light";
        }
        return defaultTheme;
    });

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
