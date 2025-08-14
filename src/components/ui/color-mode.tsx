"use client";

import * as React from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { IconButton } from "@chakra-ui/react";
import { FiMoon, FiSun } from "react-icons/fi";

interface ColorModeProviderProps {
  children: React.ReactNode;
}

export function ColorModeProvider({ children }: ColorModeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="century-360-theme"
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

export function useColorMode() {
  const { theme, setTheme } = useTheme();

  const toggleColorMode = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return {
    colorMode: theme || "light",
    toggleColorMode,
    setColorMode: setTheme,
  };
}

export function ColorModeButton() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <IconButton aria-label="Toggle color mode" variant="ghost" disabled>
        <FiSun />
      </IconButton>
    );
  }

  const isDark = theme === "dark";

  return (
    <IconButton
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      variant="ghost"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <FiSun /> : <FiMoon />}
    </IconButton>
  );
}

// Hook to get values based on color mode
export function useColorModeValue<T>(lightValue: T, darkValue: T): T {
  const { theme } = useTheme();
  return theme === "dark" ? darkValue : lightValue;
}
