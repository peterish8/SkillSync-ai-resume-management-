'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, Lightbulb, RefreshCw, Download, FileText } from 'lucide-react';

interface AnalysisResult {
  score: number;
  strengths: string[];
  improvements: string[];
}

export default function ResumeDetailView() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setResult(data.ai_feedback);
      }
      setLoading(false);
    };
    fetchResume();
  }, []);

  if (loading) return <div className="text-[var(--text-tertiary)]">Loading analysis...</div>;

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Score Section */}
      <div className="relative overflow-hidden rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-10 text-center shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--green-glow)]/20 to-transparent opacity-50 pointer-events-none"></div>
        
        <h2 className="text-sm font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-6 relative z-10">Your Resume Score</h2>
        
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 flex items-center justify-center mb-6">
            {/* Background Circle */}
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="var(--bg-tertiary)" strokeWidth="12" fill="transparent" />
              <circle 
                cx="80" cy="80" r="70" 
                stroke="var(--green-500)" strokeWidth="12" fill="transparent" strokeLinecap="round"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * (result?.score || 0)) / 100}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="text-5xl font-extrabold text-white">
              {result?.score || 0}
              <span className="text-lg text-[var(--text-tertiary)] block font-medium mt-1">/100</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">
            {(result?.score || 0) > 75 ? "Excellent! You're ready to apply." : "Good start, but needs improvements."}
          </h3>
          
          <div className="flex gap-4 mt-6">
            <button className="px-5 py-2.5 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-medium)] rounded-lg text-sm font-medium text-white transition-all flex items-center gap-2">
              <RefreshCw size={16} /> Re-analyze
            </button>
             <button className="px-5 py-2.5 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-medium)] rounded-lg text-sm font-medium text-white transition-all flex items-center gap-2">
              <Download size={16} /> Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Strengths & Improvements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] border-l-4 border-l-[var(--success)] rounded-xl p-8 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[rgba(16,185,129,0.1)] rounded-lg text-[var(--success)]">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Strengths</h3>
          </div>
          
          <ul className="space-y-4">
            {result?.strengths?.map((str, i) => (
              <li key={i} className="flex gap-3 text-[var(--text-secondary)]">
                <CheckCircle2 size={18} className="text-[var(--success)] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{str}</span>
              </li>
            )) || <p className="text-[var(--text-tertiary)] italic">No analysis data yet.</p>}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] border-l-4 border-l-[var(--warning)] rounded-xl p-8 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[rgba(245,158,11,0.1)] rounded-lg text-[var(--warning)]">
              <Lightbulb size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Improvements</h3>
          </div>
          
          <ul className="space-y-4">
            {result?.improvements?.map((imp, i) => (
              <li key={i} className="flex gap-3 text-[var(--text-secondary)]">
                <Lightbulb size={18} className="text-[var(--warning)] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{imp}</span>
              </li>
            )) || <p className="text-[var(--text-tertiary)] italic">No analysis data yet.</p>}
          </ul>
        </div>
      </div>

      {/* Resume Text Editor (Visual Placeholder) */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-8">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FileText size={20} className="text-[var(--text-tertiary)]" /> Resume Content
        </h3>
        <div className="w-full h-64 bg-[var(--bg-input)] border border-[var(--border-medium)] rounded-lg p-4 font-mono text-sm text-[var(--text-secondary)] overflow-y-auto">
          {/* We would load the resume text here */}
          <p className="opacity-50 italic">Resume text content...</p>
        </div>
      </div>
    </div>
  );
}
