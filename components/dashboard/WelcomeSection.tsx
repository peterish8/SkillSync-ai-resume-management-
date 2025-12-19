'use client';

import { CheckCircle2, Circle, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ResumeAnalysis {
  score: number;
  strengths: string[];
  improvements: string[];
}

export default function WelcomeSection({ userName = 'John' }: { userName?: string }) {
  const [aiInsights, setAiInsights] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplications, setHasApplications] = useState(false);
  const [hasProgress, setHasProgress] = useState(false);

  useEffect(() => {
    fetchLatestResume();
    fetchApplicationProgress();
  }, []);

  const fetchLatestResume = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('resumes')
        .select('ai_feedback')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data?.ai_feedback) {
        setAiInsights(data.ai_feedback as ResumeAnalysis);
      }
    } catch (error) {
      console.log('No resume analysis yet');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationProgress = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: applications } = await supabase
        .from('applications')
        .select('status')
        .eq('user_id', session.user.id);

      if (applications && applications.length > 0) {
        setHasApplications(true);
        // Check if any application has progressed beyond "Applied"
        const progressedStatuses = ['Interview', 'Offer', 'Rejected', 'Not selected'];
        const hasAnyProgress = applications.some(app => 
          progressedStatuses.includes(app.status)
        );
        setHasProgress(hasAnyProgress);
      }
    } catch (error) {
      console.log('No applications yet');
    }
  };

  // Dynamic progress state
  const steps = [
    { label: 'Paste your resume for feedback', completed: !!aiInsights },
    { label: "Add the jobs you've applied to", completed: hasApplications },
    { label: 'Track progress as you hear back', completed: hasProgress },
  ];

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-8 shadow-2xl">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse 100% 60% at 50% 0%,
              rgba(62, 207, 142, 0.08),
              transparent
            )
          `
        }}
      />

      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Good morning, {userName} <span className="text-2xl ml-1">👋</span>
        </h1>
        <p className="text-[var(--text-secondary)] mb-6 text-base">
          Let's get your job search organized
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Quick Start Checklist */}
          <div className="bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-subtle)] rounded-xl p-5">
            <p className="text-xs uppercase tracking-wider font-semibold text-[var(--text-tertiary)] mb-3">
              Quick Start
            </p>
            <ul className="space-y-2.5">
              {steps.map((step, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-sm group cursor-pointer transition-colors duration-200">
                  {step.completed ? (
                    <CheckCircle2 size={18} className="text-[var(--green-500)]" />
                  ) : (
                    <Circle size={18} className="text-[var(--text-tertiary)] group-hover:text-[var(--green-400)] transition-colors" />
                  )}
                  <span className={`${step.completed ? 'text-[var(--text-secondary)] line-through opacity-70' : 'text-white group-hover:text-[var(--green-400)] transition-colors'}`}>
                    {step.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ATS Insights */}
          <div className="bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-subtle)] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-[var(--green-500)]" />
              <p className="text-xs uppercase tracking-wider font-semibold text-[var(--text-tertiary)]">
                ATS Insights
              </p>
            </div>
            
            {loading ? (
              <p className="text-sm text-[var(--text-tertiary)]">Screening...</p>
            ) : aiInsights ? (
              <div className="space-y-3">
                {/* Score */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--text-secondary)]">ATS Match Score:</span>
                  <span className="font-bold text-[var(--green-500)]">{aiInsights.score} / 100</span>
                </div>
                {/* Key Observation */}
                {aiInsights.improvements && aiInsights.improvements[0] && (
                  <div className="text-sm">
                    <span className="text-[var(--text-tertiary)] font-medium block mb-1">Key Observation:</span>
                    <span className="text-[var(--text-secondary)]">{aiInsights.improvements[0].slice(0, 100)}{aiInsights.improvements[0].length > 100 ? '...' : ''}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-tertiary)]">
                Upload your resume to get ATS screening feedback
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
