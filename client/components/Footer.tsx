import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <span className="text-xl font-bold text-zinc-900">VectorVista</span>
          <p className="text-sm text-zinc-500 text-center">© 2026 VectorVista. All rights reserved.</p>
        </div>

        <div className="flex items-center gap-4">
          <a href="https://github.com/Dattatray8/vectorvista" className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
