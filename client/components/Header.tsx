'use client'

import { Layers, Github } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => router.push('/')}
        >
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-zinc-900 tracking-tight">VectorVista</span>
            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Semantic Search</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Dattatray8/vectorvista"
            className="p-2 text-zinc-500 hover:text-zinc-900 transition-colors"
            aria-label="GitHub Repository"
          >
            <Github className="w-6 h-6" />
          </a>
        </div>
      </div>
    </header>
  );
}
