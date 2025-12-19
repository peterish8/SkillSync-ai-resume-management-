'use client';

import { TrendingUp, Users, CheckCircle, XCircle } from 'lucide-react';

interface Metrics {
  total: number;
  interviews: number;
  offers: number;
  rejected: number;
  responseRate: number;
}

export default function MetricsCards({ metrics }: { metrics: Metrics }) {
  const cards = [
    {
      label: 'Total Applications',
      value: metrics.total,
      icon: Users,
      color: 'text-[var(--text-primary)]',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Interviews',
      value: metrics.interviews,
      icon: TrendingUp,
      color: 'text-[var(--warning)]',
      bg: 'bg-[var(--warning)]/10',
    },
    {
      label: 'Offers',
      value: metrics.offers,
      icon: CheckCircle,
      color: 'text-[var(--green-500)]',
      bg: 'bg-[var(--green-500)]/10',
    },
    {
      label: 'Response Rate',
      value: `${metrics.responseRate}%`,
      icon: TrendingUp, // Reuse or find better
      color: 'text-[var(--info)]',
      bg: 'bg-[var(--info)]/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 hover:border-[var(--border-medium)] transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
              <card.icon size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{card.value}</div>
          <div className="text-sm text-[var(--text-tertiary)]">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
