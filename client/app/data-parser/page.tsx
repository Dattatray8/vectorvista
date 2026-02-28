'use client'

import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Upload, FileJson, CheckCircle2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

const DEFAULT_JSON = `[
  {
    "orderId": "ORD-101",
    "customer": "Rahul",
    "status": "pending",
    "amount": 5400
  },
  {
    "orderId": "ORD-102",
    "customer": "Sarah",
    "status": "completed",
    "amount": 1250
  }
]`;


export default function DataImportPage() {
  const [jsonContent, setJsonContent] = useState(DEFAULT_JSON);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setJsonContent(content);
      };
      reader.readAsText(file);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/json') {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setJsonContent(content);
      };
      reader.readAsText(file);
    }
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      const session_id = localStorage.getItem('session_id');
      const parsedJson = JSON.parse(jsonContent);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/embedding`, { userData: parsedJson, session_id });
      toast.success(res.data.message || 'Data processed successfully');
      localStorage.setItem('session_id', res.data.session_id);
      router.push('/search');
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
      console.error('Invalid JSON:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-zinc-900">Import Your Data</h1>
        <p className="text-zinc-600">Upload or paste MongoDB JSON to begin semantic search.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Monaco Editor Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
              <FileJson className="w-4 h-4" />
              Option A: Paste JSON
            </h2>
          </div>
          <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-sm bg-white">
            <Editor
              height="300px"
              defaultLanguage="json"
              theme="light"
              value={jsonContent}
              onChange={(value) => setJsonContent(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>
        </div>

        <div className="relative flex items-center py-4">
          <div className="grow border-t border-zinc-200"></div>
          <span className="shrink mx-4 text-zinc-400 text-sm font-medium">OR</span>
          <div className="grow border-t border-zinc-200"></div>
        </div>

        {/* File Upload Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Option B: Upload JSON File
          </h2>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all 
            ${isDragging ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-400 bg-white"} 
            ${fileName && "border-emerald-500 bg-emerald-50/30"}`}          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            {fileName ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                <p className="font-medium text-zinc-900">File uploaded: {fileName}</p>
                <p className="text-sm text-zinc-500">Click or drag to replace</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-2">
                  <Upload className="w-6 h-6 text-zinc-400" />
                </div>
                <p className="font-medium text-zinc-900">Drag & drop support</p>
                <p className="text-sm text-zinc-500">Click to browse .json files</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleNext}
          disabled={!jsonContent.trim() || jsonContent === DEFAULT_JSON || loading}
          className="flex items-center cursor-pointer gap-2 px-8 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
