// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Promptfolio by Ben McNulty",
    default: "Promptfolio by Ben McNulty",
  },
  description: "AI Prompt Crafting, Engineering & Applications.",
  metadataBase: new URL("https://promptfolio.dev/"),
  creator: "Ben McNulty",
  keywords: ["prompt", "ai", "gpt", "promptfolio", "ben mcnulty"],
  openGraph: {
    siteName: "Promptfolio by Ben McNulty",
    images: [
      {
        url: `https://www.promptfolio.dev/brainstormer.png`,
        width: 1024,
        height: 1024,
      },
      {
        url: "https://www.promptfolio.dev/hero.png",
        width: 1792,
        height: 1024,
        alt: "Welcome to Promptfolio by Ben McNulty",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
