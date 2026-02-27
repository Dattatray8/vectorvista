'use client'

import Footer from '@/components/Footer';
import { Database, Search, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useEffect } from 'react';

const features = [
  {
    title: 'Upload JSON or MongoDB export',
    description: 'Easily import your data via file upload or direct paste with syntax highlighting.',
    icon: Database,
  },
  {
    title: 'Natural language search',
    description: 'Query your data using plain English. No complex query languages required.',
    icon: Search,
  },
  {
    title: 'Intelligent semantic retrieval',
    description: 'Find relevant information based on meaning, not just keyword matching.',
    icon: Zap,
  },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-20 py-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-900"
        >
          Understand Your Data Instantly
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-zinc-600 leading-relaxed"
        >
          Upload JSON data, search using natural language, and discover insights using semantic search.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mt-4"
        >
          <Link href='/data-parser'
            className="px-8 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors shadow-sm"
          >
            Start Exploring
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="p-6 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-zinc-900" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">{feature.title}</h3>
            <p className="text-zinc-600 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </section>
        <Footer />
    </div>
  );
}
