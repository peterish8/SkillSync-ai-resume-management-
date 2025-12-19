'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface ChartData {
  timeSeries: { date: string; count: number }[];
  companies: { company: string; count: number }[];
  metrics: {
    total: number;
    interviews: number;
    offers: number;
    rejected: number;
    responseRate: number;
  };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-3 rounded-lg shadow-xl">
        <p className="text-white font-medium text-sm mb-1">{label}</p>
        <p className="text-[var(--green-500)] text-sm font-bold">
          {payload[0].value} Application{payload[0].value !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }
  return null;
};

export default function ChartsGrid({ data }: { data: ChartData }) {
  // Format date for display (e.g., 'Dec 19')
  const formattedTimeSeries = data.timeSeries.map(item => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Activity Chart */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Application Activity</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedTimeSeries}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
              <XAxis 
                dataKey="displayDate" 
                stroke="var(--text-tertiary)" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis 
                stroke="var(--text-tertiary)" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-medium)', strokeWidth: 2 }} />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="var(--green-500)" 
                strokeWidth={3}
                dot={{ r: 4, fill: 'var(--bg-secondary)', stroke: 'var(--green-500)', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: 'var(--green-500)' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Companies Chart */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Top Companies</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.companies} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="company" 
                type="category" 
                stroke="var(--text-secondary)" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <Tooltip 
                cursor={{ fill: 'var(--bg-tertiary)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  borderColor: 'var(--border-subtle)', 
                  color: 'white',
                  borderRadius: '0.5rem'
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                {data.companies.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index < 3 ? 'var(--green-500)' : 'var(--text-tertiary)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
