import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VectorVista - AI-Powered Semantic Data Search Platform",
  description: "Upload JSON data and search using natural language with intelligent semantic retrieval. Find relevant information based on meaning, not just keywords. Free AI-powered data search tool.",
  keywords: [
    "semantic search",
    "JSON search",
    "natural language search",
    "data analysis",
    "MongoDB export",
    "AI search",
    "vector search",
    "intelligent search",
    "data retrieval",
    "semantic analysis"
  ],
  authors: [{ name: "VectorVista Team" }],
  creator: "VectorVista",
  publisher: "VectorVista",
  abstract: "Semantic data search and retrieval platform powered by AI",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://vectorvista.vercel.app"),
  alternates: {
    canonical: "https://vectorvista.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vectorvista.vercel.app",
    title: "VectorVista - AI-Powered Semantic Data Search Platform",
    description: "Upload JSON data and search using natural language with intelligent semantic retrieval. Find relevant information based on meaning, not just keywords.",
    siteName: "VectorVista",
    images: [
      {
        url: "https://vectorvista.vercel.app/icon.png",
        width: 192,
        height: 192,
        alt: "VectorVista Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "VectorVista - AI-Powered Semantic Data Search",
    description: "Search JSON data using natural language with AI-powered semantic retrieval",
    images: "https://vectorvista.vercel.app/icon.png",
    creator: "@vectorvista",
    site: "@vectorvista",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  applicationName: "VectorVista",
  category: "Productivity",
  referrer: "origin-when-cross-origin",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VectorVista",
  },
  verification: {
    google: "CUgZ4iltYciqsTDuhbAUXfdWx_iZcCR_ubltPVw-cXE",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
  colorScheme: "light",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "VectorVista",
    "alternateName": "Vector Vista",
    "description": "AI-powered semantic data search platform for JSON and MongoDB data. Search using natural language with intelligent retrieval.",
    "url": "https://vectorvista.vercel.app",
    "image": "https://vectorvista.vercel.app/og-image.png",
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "DataManagement",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "1",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Natural language search",
      "JSON file upload",
      "MongoDB export support",
      "Semantic retrieval based on meaning",
      "Real-time search results",
      "Vector embeddings",
      "Multi-session support"
    ],
    "browserRequirements": "HTML5",
    "downloadUrl": "https://vectorvista.vercel.app",
    "softwareRequirements": "Modern web browser",
    "operatingSystem": "Web-based, platform independent"
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        cz-shortcut-listen="true"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
