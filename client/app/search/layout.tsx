import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Semantic Search - Query Your Data | VectorVista",
  description: "Search your uploaded data using natural language with AI-powered semantic retrieval. Ask questions and get intelligent results based on meaning.",
  keywords: ["semantic search", "natural language query", "AI search", "data search", "speech recognition search", "intelligent retrieval"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vectorvista.com/search",
    title: "Semantic Search - Query Your Data | VectorVista",
    description: "Search your uploaded data using natural language with AI-powered semantic retrieval.",
  },
  twitter: {
    card: "summary",
    title: "Semantic Search - Query Your Data | VectorVista",
    description: "Search your uploaded data using natural language with AI-powered semantic retrieval.",
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
