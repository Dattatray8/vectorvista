import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Semantic Search - Query Your Data | VectorVista",
  description: "Search your uploaded data using natural language with AI-powered semantic retrieval. Ask questions and get intelligent results based on meaning. Includes speech recognition.",
  keywords: ["semantic search engine", "natural language query", "AI search", "data search", "speech recognition search", "intelligent retrieval", "vector search", "meaning-based search"],
  alternates: {
    canonical: "https://vectorvista.vercel.app/search",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vectorvista.vercel.app/search",
    title: "Semantic Search - Query Your Data | VectorVista",
    description: "Search your uploaded data using natural language with AI-powered semantic retrieval based on meaning.",
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
    title: "Semantic Search - Query Your Data | VectorVista",
    description: "Search your uploaded data using natural language with AI-powered semantic retrieval and speech recognition.",
    images: "https://vectorvista.vercel.app/icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
