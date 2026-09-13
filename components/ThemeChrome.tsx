"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

const themeColors = {
  light: "#faf9fc",
  dark: "#12101d",
} as const;

export function ThemeChrome() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme !== "light" && resolvedTheme !== "dark") return;

    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"][data-promptfolio-theme]',
    );

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.dataset.promptfolioTheme = "true";
      document.head.append(meta);
    }

    meta.content = themeColors[resolvedTheme];
  }, [resolvedTheme]);

  return null;
}
