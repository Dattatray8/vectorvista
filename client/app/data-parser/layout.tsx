import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Parser - Import & Upload JSON | VectorVista",
  description: "Import your JSON or MongoDB export files for semantic analysis. Upload data directly or paste JSON with syntax highlighting.",
  keywords: ["JSON upload", "data import", "MongoDB export", "JSON parser", "data analyzer", "semantic search preparation"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vectorvista.com/data-parser",
    title: "Data Parser - Import & Upload JSON | VectorVista",
    description: "Import your JSON or MongoDB export files for semantic analysis.",
  },
  twitter: {
    card: "summary",
    title: "Data Parser - Import & Upload JSON | VectorVista",
    description: "Import your JSON or MongoDB export files for semantic analysis.",
  },
};

export default function DataParserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
