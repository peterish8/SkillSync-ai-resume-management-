'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useGuest } from '@/components/providers/GuestContext';

interface DashboardStats {
  totalApps: number;
  interviews: number;
  offers: number;
  responseRate: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<DashboardStats>({
    totalApps: 0,
    interviews: 0,
    offers: 0,
    responseRate: 0
  });
  const [loading, setLoading] = useState(true);
  const { isGuest } = useGuest();

  useEffect(() => {
    const fetchStats = async () => {
      if (isGuest) {
        setLoading(false);
        return;
      }
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: applications, error } = await supabase
          .from('applications')
          .select('status')
          .eq('user_id', session.user.id);
        
        if (error) throw error;

        const totalApps = applications?.length || 0;
        const interviews = applications?.filter(app => app.status === 'Interview').length || 0;
        const offers = applications?.filter(app => app.status === 'Offer').length || 0;
        
        // Calculate response rate: (Interviews + Offers) / Total Apps
        const responseCount = interviews + offers;
        const responseRate = totalApps > 0 ? Math.round((responseCount / totalApps) * 100) : 0;

        setStats({
          totalApps,
          interviews,
          offers,
          responseRate
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    { 
      label: 'Total Applications', 
      value: stats.totalApps.toString(), 
      change: 'Lifetime', 
      trend: 'neutral',
      color: 'var(--text-primary)' 
    },
    { 
      label: 'Interviews', 
      value: stats.interviews.toString(), 
      change: 'Active', 
      trend: 'up',
      color: 'var(--warning)' 
    },
    { 
      label: 'Offers', 
      value: stats.offers.toString(), 
      change: 'Win!', 
      trend: 'up',
      color: 'var(--green-500)',
      isHighlight: true
    },
    { 
      label: 'Response Rate', 
      value: `${stats.responseRate}%`, 
      change: 'Avg', 
      trend: 'neutral',
      color: 'var(--info)' 
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((stat, idx) => (
        <div 
          key={idx} 
          className="group relative bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:border-[var(--border-green)]"
        >
          {stat.isHighlight && (
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--green-500)] to-transparent opacity-50"></div>
          )}
          
          <h3 className="text-sm font-medium text-[var(--text-tertiary)] mb-1">{stat.label}</h3>
          
          <div className="flex items-end justify-between">
            <div className={`text-3xl font-extrabold tracking-tight`} style={{ color: stat.isHighlight ? 'var(--green-500)' : 'white' }}>
              {stat.value}
            </div>
            
            <div className={`text-xs font-semibold flex items-center gap-1 text-[var(--text-tertiary)]`}>
              {stat.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
