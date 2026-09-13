"use client";

import * as React from "react";
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

function LightModeGlyph() {
  return (
    <svg className="theme-glyph" viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <radialGradient id="theme-sun-glass" cx="0" cy="0" r="1" gradientTransform="translate(13.4 12.7) rotate(47) scale(11.2)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fffdf0" />
          <stop offset=".34" stopColor="#fff2b8" />
          <stop offset=".76" stopColor="#f1d77f" />
          <stop offset="1" stopColor="#c9a9dd" />
        </radialGradient>
      </defs>
      <g className="theme-glyph-rays">
        <path d="M16 3.7v3M16 25.3v3M3.7 16h3M25.3 16h3M7.3 7.3l2.15 2.15M22.55 22.55l2.15 2.15M24.7 7.3l-2.15 2.15M9.45 22.55 7.3 24.7" />
      </g>
      <circle className="theme-glyph-halo" cx="16" cy="16" r="7.15" />
      <circle className="theme-glyph-sun-sphere" cx="16" cy="16" r="6.25" fill="url(#theme-sun-glass)" />
      <ellipse className="theme-glyph-sun-highlight" cx="13.55" cy="13.15" rx="1.65" ry="1.05" transform="rotate(-35 13.55 13.15)" />
    </svg>
  );
}

function DarkModeGlyph() {
  return (
    <svg className="theme-glyph" viewBox="0 0 32 32" aria-hidden="true">
      <path className="theme-glyph-orbit" d="M24.9 25.2c3.35-4.15 3.75-9.6.95-14.15" />
      <path className="theme-glyph-crescent" transform="translate(4 4)" d="M21.75 15A9.72 9.72 0 0 1 18 15.75 9.75 9.75 0 0 1 9 2.25 9.75 9.75 0 1 0 21.75 15Z" />
      <path className="theme-glyph-star theme-glyph-star--large" d="M21.6 6.2c.45 1.9 1.65 3.1 3.55 3.55-1.9.45-3.1 1.65-3.55 3.55-.45-1.9-1.65-3.1-3.55-3.55 1.9-.45 3.1-1.65 3.55-3.55Z" />
      <path className="theme-glyph-star theme-glyph-star--small" d="M8.2 6.1c.25 1.05.95 1.75 2 2-1.05.25-1.75.95-2 2-.25-1.05-.95-1.75-2-2 1.05-.25 1.75-.95 2-2Z" />
      <circle className="theme-glyph-satellite" cx="27.45" cy="18.2" r="1.15" />
    </svg>
  );
}

function SystemModeGlyph() {
  return (
    <svg className="theme-glyph" viewBox="0 0 32 32" aria-hidden="true">
      <ellipse className="theme-glyph-system-orbit" cx="16" cy="16" rx="12.25" ry="8.65" transform="rotate(-24 16 16)" />
      <g className="theme-glyph-system-sun">
        <circle cx="11.15" cy="11.2" r="3.45" />
        <path d="M11.15 5.7v1.45M11.15 15.25v1.45M5.65 11.2H7.1M15.2 11.2h1.45M7.25 7.3l1.05 1M14 14l1.05 1M15.05 7.3 14 8.3M8.3 14l-1.05 1" />
      </g>
      <path className="theme-glyph-system-moon" d="M23.65 21.15a6.45 6.45 0 0 1-7.55-8.8 6.5 6.5 0 1 0 7.55 8.8Z" />
      <path className="theme-glyph-system-spark" d="M20.55 7.2c.35 1.45 1.25 2.35 2.7 2.7-1.45.35-2.35 1.25-2.7 2.7-.35-1.45-1.25-2.35-2.7-2.7 1.45-.35 2.35-1.25 2.7-2.7Z" />
      <circle className="theme-glyph-satellite" cx="28.05" cy="14.05" r="1.15" />
    </svg>
  );
}

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
      <span className="theme-cycle-icon theme-cycle-icon--light" aria-hidden="true"><LightModeGlyph /></span>
      <span className="theme-cycle-icon theme-cycle-icon--dark" aria-hidden="true"><DarkModeGlyph /></span>
      <span className="theme-cycle-icon theme-cycle-icon--system" aria-hidden="true"><SystemModeGlyph /></span>
    </button>
  );
}
