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
  title: "VectorVista - AI-Powered Semantic Data Search",
  description: "Upload JSON data and search using natural language with intelligent semantic retrieval. Find relevant information based on meaning, not just keywords.",
  keywords: ["semantic search", "JSON search", "natural language search", "data analysis", "MongoDB export", "AI search"],
  authors: [{ name: "VectorVista" }],
  creator: "VectorVista",
  publisher: "VectorVista",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vectorvista.com",
    title: "VectorVista - AI-Powered Semantic Data Search",
    description: "Upload JSON data and search using natural language with intelligent semantic retrieval.",
    siteName: "VectorVista",
  },
  twitter: {
    card: "summary_large_image",
    title: "VectorVista - AI-Powered Semantic Data Search",
    description: "Upload JSON data and search using natural language with intelligent semantic retrieval.",
    creator: "@vectorvista",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  applicationName: "VectorVista",
  referrer: "origin-when-cross-origin",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VectorVista",
  },
  verification: {
    google: "your-google-verification-code",
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
    "description": "AI-powered semantic data search platform for JSON and MongoDB data",
    "url": "https://vectorvista.com",
    "applicationCategory": "DataAnalysis",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Natural language search",
      "JSON file upload",
      "MongoDB export support",
      "Semantic retrieval",
      "Speech recognition"
    ]
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
