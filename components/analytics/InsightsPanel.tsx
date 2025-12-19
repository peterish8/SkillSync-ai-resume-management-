'use client';

import { Lightbulb } from 'lucide-react';

interface Metrics {
  total: number;
  interviews: number;
  offers: number;
  rejected: number;
  responseRate: number;
}

export default function InsightsPanel({ metrics }: { metrics: Metrics }) {
  const generateInsights = () => {
    const insights = [];

    if (metrics.total === 0) {
      insights.push('Start tracking your applications to see analytics here.');
    } else {
        if (metrics.responseRate < 10) {
            insights.push('Your response rate is below 10%. Consider refining your resume or targeting more relevant roles.');
        } else if (metrics.responseRate > 20) {
            insights.push('Great response rate! Your resume and profile are resonating well.');
        }

        if (metrics.offers > 0) {
            insights.push('You’re converting interviews into offers clearly. Keep applying consistently.');
        }

        if (metrics.interviews > 0 && metrics.offers === 0) {
            insights.push('You are getting interviews but no offers yet. Brush up on your interview skills.');
        }
        
        if (metrics.total > 20 && metrics.interviews === 0) {
            insights.push('You have applied to over 20 jobs without an interview. Focus on quality over quantity.');
        }
    }
    
    // Default insight if none trigger
    if (insights.length === 0 && metrics.total > 0) {
        insights.push('Keep going! Consistency is key in the job search.');
    }

    return insights;
  };

  const insights = generateInsights();

  if (insights.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Lightbulb size={100} className="text-[var(--text-primary)]" />
      </div>
      
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="p-2 bg-[var(--green-500)]/10 text-[var(--green-500)] rounded-lg">
           <Lightbulb size={20} />
        </div>
        <h3 className="text-lg font-bold text-white">AI Insights</h3>
      </div>
      
      <ul className="space-y-3 relative z-10">
        {insights.map((insight, i) => (
          <li key={i} className="flex gap-3 text-[var(--text-secondary)] text-sm leading-relaxed">
            <span className="text-[var(--green-500)] mt-0.5">•</span>
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
}
