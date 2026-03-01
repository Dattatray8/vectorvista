'use client'

import { useState, useEffect, useRef } from 'react';
import { Search, Mic, Loader2, Database, Code2, MicOff, Copy, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import axios from 'axios';
import ReactMarkdown from "react-markdown";

export default function QueryPage() {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [summary, setSummary] = useState<string>('');
    const recognitionRef = useRef<any>(null);
    const [limit, setLimit] = useState<number>(5);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setQuery((prev) => (prev ? `${prev} ${transcript}` : transcript));
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const downloadJSON = () => {
        const blob = new Blob([JSON.stringify(results, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "search-results.json";
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Exported JSON");
    };

    const handleSearchQuery = async () => {
        if (!query.trim()) return;
        setIsSearching(true);
        try {
            const session_id = localStorage.getItem('session_id');
            const res = await axios.post(`https://vectorvista.duckdns.org/api/v1/search`, { query, session_id, limit });
            setResults(res.data.results || []);
            setSummary(res.data.summary || '');
            toast.success(res.data.message || 'Data processed successfully');
            setHasSearched(true);
        } catch (error) {
            setIsSearching(false);
            toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
            console.error('Invalid JSON:', error);
        } finally {
            setIsSearching(false);
        }
    }

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (error) {
                console.error('Failed to start speech recognition:', error);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-zinc-900">Ask Questions About Your Data</h1>
                <p className="text-zinc-600">Search using natural language to find relevant information.</p>
            </div>

            {/* Query Input Area */}
            <div className="relative group">
                <div className="absolute inset-0 bg-zinc-900/5 rounded-2xl blur-xl group-focus-within:bg-zinc-900/10 transition-all"></div>
                <div className="relative bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden focus-within:border-zinc-400 transition-all">
                    <div className="flex items-center gap-2 bg-zinc-100 px-3 py-2 rounded-t-lg">
                            <span className="text-xs text-zinc-500 font-medium">Limit</span>
                            <input
                                type="number"
                                min={1}
                                value={limit}
                                onChange={(e) => setLimit(Number(e.target.value))}
                                className="w-16 bg-transparent outline-none text-sm text-zinc-900"
                            />
                        </div>
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='e.g., "Show pending orders from last week"'
                        className="w-full p-6 pb-16 text-lg bg-transparent border-none outline-none focus:ring-0 resize-none min-h-30 placeholder:text-zinc-400"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSearchQuery();
                            }
                        }}
                    />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <button
                            onClick={toggleListening}
                            className={
                                `p-2 rounded-lg transition-all flex items-center gap-2 ${isListening
                                    ? "bg-red-50 text-red-600 animate-pulse"
                                    : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50"
                                }`
                            }
                            title={isListening ? "Stop listening" : "Start voice input"}
                        >
                            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            {isListening && <span className="text-xs font-semibold uppercase tracking-wider">Listening...</span>}
                        </button>
                    </div>
                    <div className="absolute bottom-4 right-4">
                        <button
                            onClick={handleSearchQuery}
                            disabled={!query.trim() || isSearching}
                            className="flex items-center cursor-pointer gap-2 px-6 py-2 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSearching ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <Search className="w-4 h-4" />
                                    Search
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                    Results
                </h2>

                <AnimatePresence mode="wait">
                    {!hasSearched ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="border-2 border-dashed border-zinc-200 rounded-2xl p-20 flex flex-col items-center justify-center text-center gap-4 bg-zinc-50/50"
                        >
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-2">
                                <Database className="w-8 h-8 text-zinc-300" />
                            </div>
                            <p className="text-zinc-500 font-medium">Submit a query to view semantic results.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-bottom border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                                    <h3 className="font-semibold text-zinc-900">Semantic Summary</h3>
                                    <span className="text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">{results.length} Matches Found</span>
                                </div>
                                <div className="p-6 text-zinc-600 leading-relaxed">
                                    <ReactMarkdown
                                        components={{
                                            p: ({ children }) => <p style={{ marginBottom: '12px', lineHeight: '1.6' }}>{children}</p>,
                                            ul: ({ children }) => <ul style={{ listStyleType: 'disc', marginLeft: '20px', marginBottom: '12px' }}>{children}</ul>,
                                            ol: ({ children }) => <ol style={{ listStyleType: 'decimal', marginLeft: '20px', marginBottom: '12px' }}>{children}</ol>,
                                            li: ({ children }) => <li style={{ marginBottom: '4px' }}>{children}</li>,
                                            h1: ({ children }) => <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '16px 0 8px' }}>{children}</h1>,
                                            h2: ({ children }) => <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '14px 0 7px' }}>{children}</h2>,
                                            h3: ({ children }) => <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: '12px 0 6px' }}>{children}</h3>,
                                            code: ({ node, inline, className, children, ...props }: any) => {
                                                return inline ? (
                                                    <code style={{ backgroundColor: '#f3f4f6', padding: '2px 5px', borderRadius: '4px', fontSize: '13px', color: '#e03e2d', fontFamily: 'monospace' }} {...props}>
                                                        {children}
                                                    </code>
                                                ) : (
                                                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', margin: '12px 0', overflowX: 'auto' }}>
                                                        <code style={{ fontSize: '13px', color: '#1e293b', fontFamily: 'monospace', whiteSpace: 'pre' }} {...props}>
                                                            {children}
                                                        </code>
                                                    </div>
                                                );
                                            },
                                            blockquote: ({ children }) => (
                                                <blockquote style={{ borderLeft: '4px solid #4f46e5', paddingLeft: '12px', color: '#4b5563', fontStyle: 'italic', margin: '12px 0' }}>
                                                    {children}
                                                </blockquote>
                                            ),
                                            table: ({ children }) => (
                                                <div style={{ overflowX: 'auto', margin: '12px 0' }}>
                                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>{children}</table>
                                                </div>
                                            ),
                                            th: ({ children }) => <th style={{ border: '1px solid #e5e7eb', padding: '8px', backgroundColor: '#f9fafb', textAlign: 'left' }}>{children}</th>,
                                            td: ({ children }) => <td style={{ border: '1px solid #e5e7eb', padding: '8px' }}>{children}</td>,
                                        }}
                                    >
                                        {summary || "No summary available for this query."}
                                    </ReactMarkdown>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
                                    <div className='flex justify-between'>
                                        <div className="flex items-center gap-2 text-zinc-900 font-semibold">
                                            <Code2 className="w-4 h-4" />
                                            JSON Preview
                                        </div>
                                        <div className='flex gap-2'>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(JSON.stringify(results, null, 2));
                                                    toast.success("Copied to clipboard");
                                                }}
                                                className="flex items-center gap-2 p-2 cursor-pointer bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-all shadow-sm"
                                            >
                                                <Copy className='w-4 h-4 opacity-80 hover:opacity-100' />
                                            </button>
                                            <button
                                                onClick={downloadJSON}
                                                className="flex items-center gap-2 p-2 cursor-pointer bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-all shadow-sm"
                                            >
                                                <Download className='w-4 h-4 opacity-80 hover:opacity-100' />
                                            </button>
                                        </div>
                                    </div>
                                    <pre className="text-xs bg-zinc-900 text-zinc-300 p-4 rounded-xl overflow-x-auto font-mono">
                                        {JSON.stringify(results, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
