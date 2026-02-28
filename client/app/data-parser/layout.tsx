import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Parser - Import & Upload JSON | VectorVista",
  description: "Import your JSON or MongoDB export files for semantic analysis. Upload data directly or paste JSON with syntax highlighting. Prepare your data for intelligent semantic search.",
  keywords: ["JSON upload", "data import", "MongoDB export", "JSON parser", "data analyzer", "semantic search preparation", "file upload", "JSON validator"],
  alternates: {
    canonical: "https://vectorvista.vercel.app/data-parser",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vectorvista.vercel.app/data-parser",
    title: "Data Parser - Import & Upload JSON | VectorVista",
    description: "Import your JSON or MongoDB export files for semantic analysis with real-time syntax validation.",
    siteName: "VectorVista",
    images: [
      {
        url: "https://vectorvista.vercel.app/icon.png",
        width: 192,
        height: 192,
        alt: "VectorVista Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Data Parser - Import & Upload JSON | VectorVista",
    description: "Import your JSON or MongoDB export files for semantic analysis with syntax highlighting.",
    images: "https://vectorvista.vercel.app/icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DataParserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
