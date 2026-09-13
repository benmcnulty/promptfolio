// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ThemeChrome } from "@/components/ThemeChrome";
import { SkipNavigation } from "@/components/SkipNavigation";
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StructuredData } from '@/components/StructuredData';
import { personSchema, siteDescription, siteName, siteUrl } from '@/lib/site';
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Promptfolio by Ben McNulty",
    default: "Promptfolio by Ben McNulty",
  },
  description: siteDescription,
  metadataBase: new URL(`${siteUrl}/`),
  applicationName: 'Promptfolio',
  category: 'technology',
  creator: "Ben McNulty",
  publisher: 'Ben McNulty',
  referrer: 'origin-when-cross-origin',
  keywords: ["prompt", "ai", "gpt", "promptfolio", "ben mcnulty", "artificial intelligence", "prompt engineering", "custom GPTs"],
  authors: [{ name: "Ben McNulty", url: "https://benlive.tv" }],
  alternates: {
    canonical: '/',
    languages: { 'en-US': '/' },
    types: { 'text/plain': '/llms.txt' },
  },
  manifest: '/manifest.webmanifest',
  formatDetection: { email: false, address: false, telephone: false },
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
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Promptfolio by Ben McNulty — purpose-built AI assistants, designed with intent.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Promptfolio by Ben McNulty",
    description: siteDescription,
    images: [{ url: "/twitter-image", alt: "Promptfolio by Ben McNulty — purpose-built AI assistants, designed with intent." }],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9fc' },
    { media: '(prefers-color-scheme: dark)', color: '#12101d' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "name": siteName,
        "description": siteDescription,
        "url": siteUrl,
        "inLanguage": "en-US",
        "author": { "@id": `${siteUrl}/about#ben-mcnulty` },
      },
      personSchema,
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head><StructuredData data={jsonLd} /></head>
      <body className={inter.className}>
        <SkipNavigation />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeChrome />
          <Header />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
