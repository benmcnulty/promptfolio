"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

type ThemeChoice = 'system' | 'dark' | 'light';

const nextTheme: Record<ThemeChoice, ThemeChoice> = {
  system: 'dark',
  dark: 'light',
  light: 'system',
};
const themeLabel: Record<ThemeChoice, string> = {
  system: 'System',
  dark: 'Dark',
  light: 'Light',
};
const subscribeToHydration = () => () => undefined;

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(subscribeToHydration, () => true, () => false);

  const activeTheme: ThemeChoice = mounted && (theme === 'dark' || theme === 'light')
    ? theme
    : 'system';
  const upcomingTheme = nextTheme[activeTheme];

  return (
    <button
      type="button"
      className="theme-cycle"
      data-theme-choice={activeTheme}
      onClick={() => setTheme(upcomingTheme)}
      aria-label={`Color theme: ${activeTheme}. Activate ${upcomingTheme} theme.`}
      title={`${themeLabel[activeTheme]} theme · switch to ${upcomingTheme}`}
      suppressHydrationWarning
    >
      <span className="theme-cycle-icon theme-cycle-icon--light" aria-hidden="true"><SunIcon /></span>
      <span className="theme-cycle-icon theme-cycle-icon--dark" aria-hidden="true"><MoonIcon /></span>
      <span className="theme-cycle-icon theme-cycle-icon--system" aria-hidden="true"><SunIcon /><MoonIcon /></span>
    </button>
  );
}
