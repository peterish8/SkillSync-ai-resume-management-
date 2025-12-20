'use client';

import { useState, useEffect } from 'react';
import { Menu, History, X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ResumeHistoryItem {
  id: string;
  resume_text: string;
  ai_score: number;
  ai_feedback: any;
  created_at: string;
}

export default function Header() {
  const [resumeHistory, setResumeHistory] = useState<ResumeHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [hasSeenHistory, setHasSeenHistory] = useState(false);

  const fetchResumeHistory = async () => {
    setHistoryLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('resumes')
        .select('id, resume_text, ai_score, ai_feedback, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setResumeHistory(data || []);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeHistory();
  }, []);

  return (
    <header className="h-[72px] bg-[var(--bg-app)] border-b border-[var(--border-subtle)] flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger - visible only on small screens */}
        <button className="lg:hidden text-[var(--text-secondary)] hover:text-white">
          <Menu size={24} />
        </button>
        
        <h2 className="text-xl font-bold text-white tracking-tight">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">

        {/* History Button */}
        <div className="relative">
          <button
            onClick={() => { setShowHistory(!showHistory); if (!showHistory) { fetchResumeHistory(); setHasSeenHistory(true); } }}
            className="relative p-2.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--green-500)] transition-all hover:scale-105"
            title="Resume History"
          >
            <History size={18} className="text-[var(--text-secondary)]" />
            {resumeHistory.length > 0 && !hasSeenHistory && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--green-500)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {resumeHistory.length}
              </span>
            )}
          </button>

          {/* History Dropdown */}
          {showHistory && (
            <div className="absolute top-12 right-0 w-80 max-h-[500px] overflow-y-auto bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-white">Resume History</h4>
                <button onClick={() => setShowHistory(false)} className="text-[var(--text-tertiary)] hover:text-white">
                  <X size={16} />
                </button>
              </div>
              
              {historyLoading ? (
                <div className="text-center py-4 text-[var(--text-tertiary)]">
                  <Loader2 size={20} className="animate-spin mx-auto" />
                </div>
              ) : resumeHistory.length === 0 ? (
                <p className="text-sm text-[var(--text-tertiary)] text-center py-4">
                  No resume history yet
                </p>
              ) : (
                <div className="space-y-2">
                  {resumeHistory.map((item) => (
                    <div key={item.id} className="bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-subtle)] overflow-hidden">
                      <div 
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-[var(--bg-elevated)] transition-colors"
                        onClick={() => setExpandedHistoryId(expandedHistoryId === item.id ? null : item.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            item.ai_score >= 70 ? 'bg-[rgba(62,207,142,0.2)] text-[var(--green-500)]' :
                            item.ai_score >= 50 ? 'bg-[rgba(245,158,11,0.2)] text-[#F59E0B]' :
                            'bg-[rgba(239,68,68,0.2)] text-[var(--error)]'
                          }`}>
                            {item.ai_score}
                          </div>
                          <div>
                            <p className="text-xs text-white font-medium">
                              {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            <p className="text-[10px] text-[var(--text-tertiary)]">
                              {new Date(item.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        {expandedHistoryId === item.id ? <ChevronUp size={14} className="text-[var(--text-tertiary)]" /> : <ChevronDown size={14} className="text-[var(--text-tertiary)]" />}
                      </div>
                      
                      {expandedHistoryId === item.id && (
                        <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-input)]">
                          <p className="text-xs text-[var(--text-secondary)] font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                            {item.resume_text.slice(0, 500)}{item.resume_text.length > 500 ? '...' : ''}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </header>
  );
}
