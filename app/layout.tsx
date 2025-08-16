// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SkipNavigation } from "@/components/SkipNavigation";
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
  keywords: ["prompt", "ai", "gpt", "promptfolio", "ben mcnulty", "artificial intelligence", "prompt engineering", "custom GPTs"],
  authors: [{ name: "Ben McNulty", url: "https://promptfolio.dev" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    siteName: "Promptfolio by Ben McNulty",
    images: [
      {
        url: `/brainstormer.png`,
        width: 1024,
        height: 1024,
      },
      {
        url: "/hero.png",
        width: 1792,
        height: 1024,
        alt: "Welcome to Promptfolio by Ben McNulty",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Promptfolio by Ben McNulty",
    description: "AI Prompt Crafting, Engineering & Applications.",
    images: [
      {
        url: "/hero.png",
        alt: "Welcome to Promptfolio by Ben McNulty",
      },
    ],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Promptfolio by Ben McNulty",
    "description": "AI Prompt Crafting, Engineering & Applications",
    "url": "https://promptfolio.dev",
    "author": {
      "@type": "Person",
      "name": "Ben McNulty",
      "jobTitle": "AI Prompt Engineer",
      "url": "https://promptfolio.dev/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Promptfolio",
      "url": "https://promptfolio.dev"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://promptfolio.dev/listing?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <SkipNavigation />
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
