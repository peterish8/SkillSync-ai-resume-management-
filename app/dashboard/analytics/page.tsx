'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import TimeRangeSelector from '@/components/analytics/TimeRangeSelector';
import MetricsCards from '@/components/analytics/MetricsCards';
import ChartsGrid from '@/components/analytics/ChartsGrid';
import InsightsPanel from '@/components/analytics/InsightsPanel';
import { Loader2 } from 'lucide-react';

export default function AnalyticsPage() {
  const [range, setRange] = useState(30); // Default to 30 days for better initial view
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics?userId=${user.id}&range=${range}`);
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const jsonData = await res.json();
        setData(jsonData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, range]);

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Analytics & Insights</h1>
           <p className="text-[var(--text-secondary)] text-sm">Visualize your job search progress over time.</p>
        </div>
        <TimeRangeSelector value={range} onChange={setRange} />
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-[var(--text-tertiary)]">
                <Loader2 size={32} className="animate-spin text-[var(--green-500)]" />
                <p className="text-sm">Crunching the numbers...</p>
            </div>
        </div>
      ) : data ? (
        <>
          <MetricsCards metrics={data.metrics} />
          
          <InsightsPanel metrics={data.metrics} />

          <ChartsGrid data={data} />
        </>
      ) : (
        <div className="text-center py-12 text-[var(--text-tertiary)]">
            Failed to load analytics data.
        </div>
      )}
    </div>
  );
}
