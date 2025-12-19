'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Calendar, ArrowUp, ArrowDown, TrendingUp, Lightbulb, 
  Briefcase, CheckCircle2, XCircle, Clock, Loader2, RefreshCw
} from 'lucide-react';

// Color Palette
const COLORS = {
  primary: '#3ECF8E',
  secondary: '#6366F1',
  warning: '#F59E0B',
  error: '#EF4444',
  text: '#8B92A7',
  grid: '#2A3142'
};

const CHART_COLORS = ['#3ECF8E', '#6366F1', '#F59E0B', '#EF4444'];

interface Application {
  id: string;
  company: string;
  position: string;
  status: string;
  applied_date: string;
}

interface AIInsight {
  type: 'success' | 'info' | 'warning';
  title: string;
  description: string;
}

export default function AnalyticsView() {
  const [timeRange, setTimeRange] = useState('last_7_days');
  const [dateRangeLabel, setDateRangeLabel] = useState('Last 7 Days');
  const [loading, setLoading] = useState(true);
  
  // Real data state
  const [applications, setApplications] = useState<Application[]>([]);
  const [metrics, setMetrics] = useState({
    totalApps: 0,
    interviewRate: 0,
    avgResponseTime: 5,
    activeApps: 0
  });
  const [statusData, setStatusData] = useState<{name: string; value: number}[]>([]);
  const [companyData, setCompanyData] = useState<{name: string; count: number}[]>([]);
  
  // AI Insights state
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);

  // Placeholder chart data (time-series tracking not yet implemented)
  const appOverTimeData = [
    { name: 'Mon', total: 0, interviews: 0 },
    { name: 'Tue', total: 0, interviews: 0 },
    { name: 'Wed', total: 0, interviews: 0 },
    { name: 'Thu', total: 0, interviews: 0 },
    { name: 'Fri', total: 0, interviews: 0 },
    { name: 'Sat', total: 0, interviews: 0 },
    { name: 'Sun', total: 0, interviews: 0 },
  ];

  const responseRateData = [
    { name: 'Week 1', rate: metrics.interviewRate || 0 },
    { name: 'Week 2', rate: metrics.interviewRate || 0 },
    { name: 'Week 3', rate: metrics.interviewRate || 0 },
    { name: 'Week 4', rate: metrics.interviewRate || 0 },
  ];

  // Fetch real application data
  const fetchApplicationData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('applied_date', { ascending: false });

      if (data) {
        setApplications(data);
        
        // Calculate metrics
        const total = data.length;
        const interviews = data.filter(a => a.status === 'Interview').length;
        const offers = data.filter(a => a.status === 'Offer').length;
        const rejected = data.filter(a => a.status === 'Rejected').length;
        const active = data.filter(a => ['Applied', 'Interview'].includes(a.status)).length;
        
        setMetrics({
          totalApps: total,
          interviewRate: total > 0 ? Math.round(((interviews + offers) / total) * 100) : 0,
          avgResponseTime: 5,
          activeApps: active
        });

        // Status breakdown
        setStatusData([
          { name: 'Applied', value: data.filter(a => a.status === 'Applied').length },
          { name: 'Interview', value: interviews },
          { name: 'Offer', value: offers },
          { name: 'Rejected', value: rejected }
        ]);

        // Top companies
        const companyCounts: Record<string, number> = {};
        data.forEach(app => {
          companyCounts[app.company] = (companyCounts[app.company] || 0) + 1;
        });
        const topCompanies = Object.entries(companyCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }));
        setCompanyData(topCompanies);

        // Check if we need to regenerate AI insights
        const storedCount = localStorage.getItem('analyticsAppCount');
        if (!storedCount || parseInt(storedCount) !== total) {
          localStorage.setItem('analyticsAppCount', total.toString());
          await generateAIInsights(data);
        } else {
          // Load cached insights if available
          const cached = localStorage.getItem('analyticsInsights');
          if (cached) {
            setAiInsights(JSON.parse(cached));
          } else {
            await generateAIInsights(data);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate AI Insights via server API
  const generateAIInsights = async (apps: Application[]) => {
    if (apps.length === 0) {
      setAiInsights([{
        type: 'info',
        title: 'Get started',
        description: 'Add your first job application to get personalized insights!'
      }]);
      return;
    }

    setInsightsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        generateStaticInsights(apps);
        return;
      }

      const response = await fetch('/api/analytics-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const data = await response.json();
      if (data.insights) {
        setAiInsights(data.insights);
        localStorage.setItem('analyticsInsights', JSON.stringify(data.insights));
      } else {
        generateStaticInsights(apps);
      }
    } catch (err) {
      console.error('AI insights error:', err);
      generateStaticInsights(apps);
    } finally {
      setInsightsLoading(false);
    }
  };

  // Fallback static insights based on data
  const generateStaticInsights = (apps: Application[]) => {
    const total = apps.length;
    const interviews = apps.filter(a => a.status === 'Interview').length;
    const offers = apps.filter(a => a.status === 'Offer').length;
    const rejected = apps.filter(a => a.status === 'Rejected').length;
    const interviewRate = total > 0 ? Math.round(((interviews + offers) / total) * 100) : 0;

    const insights: AIInsight[] = [];

    if (interviewRate >= 30) {
      insights.push({
        type: 'success',
        title: 'Great interview rate!',
        description: `Your ${interviewRate}% interview rate is above average (20%). Keep it up!`
      });
    } else if (interviewRate > 0) {
      insights.push({
        type: 'warning',
        title: 'Room for improvement',
        description: `Your ${interviewRate}% interview rate could improve. Consider tailoring your resume.`
      });
    }

    if (rejected > total * 0.5) {
      insights.push({
        type: 'warning',
        title: 'High rejection rate',
        description: 'Consider revising your resume or targeting different role levels.'
      });
    }

    if (offers > 0) {
      insights.push({
        type: 'success',
        title: `${offers} offer${offers > 1 ? 's' : ''} received!`,
        description: 'Congratulations! Compare offers carefully before deciding.'
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: 'info',
        title: 'Keep applying',
        description: 'The more applications, the better your chances. Stay consistent!'
      });
    }

    setAiInsights(insights);
    localStorage.setItem('analyticsInsights', JSON.stringify(insights));
  };

  // Force regenerate insights (clears cache)
  const handleRefreshInsights = () => {
    localStorage.removeItem('analyticsInsights');
    localStorage.removeItem('analyticsAppCount');
    generateAIInsights(applications);
  };

  useEffect(() => {
    // Determine Label
    switch(timeRange) {
      case 'last_30_days': setDateRangeLabel('Last 30 Days'); break;
      case 'last_90_days': setDateRangeLabel('Last 90 Days'); break;
      default: setDateRangeLabel('Last 7 Days');
    }
    
    fetchApplicationData();
  }, [timeRange]);

  if (loading) return <div className="text-[var(--text-tertiary)] animate-pulse">Loading analytics...</div>;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-white tracking-tight">Analytics Overview</h2>
           <p className="text-sm text-[var(--text-tertiary)]">Track your job search performance</p>
        </div>
        
        <div className="relative">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-white focus:outline-none focus:border-[var(--green-500)] cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="last_90_days">Last 90 Days</option>
            <option value="last_year">Last Year</option>
          </select>
          <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300 relative group overflow-hidden">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 rounded-lg bg-[rgba(62,207,142,0.1)] text-[var(--green-500)]">
               <Briefcase size={20} />
             </div>
             <div className="flex items-center gap-1 text-xs font-bold text-[var(--green-500)] bg-[rgba(62,207,142,0.1)] px-2 py-0.5 rounded-full">
               <ArrowUp size={12} strokeWidth={3} /> 12%
             </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-4xl font-extrabold text-white mb-1">{metrics.totalApps}</h3>
            <p className="text-sm text-[var(--text-tertiary)] font-medium">Total Applications</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300 relative group overflow-hidden">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 rounded-lg bg-[rgba(99,102,241,0.1)] text-[#6366F1]">
               <CheckCircle2 size={20} />
             </div>
             <div className="flex items-center gap-1 text-xs font-bold text-[var(--green-500)] bg-[rgba(62,207,142,0.1)] px-2 py-0.5 rounded-full">
               <ArrowUp size={12} strokeWidth={3} /> 5%
             </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-4xl font-extrabold text-white mb-1">{metrics.interviewRate}%</h3>
            <p className="text-sm text-[var(--text-tertiary)] font-medium">Interview Rate</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300 relative group overflow-hidden">
           <div className="flex justify-between items-start mb-4">
             <div className="p-2 rounded-lg bg-[rgba(245,158,11,0.1)] text-[#F59E0B]">
               <Clock size={20} />
             </div>
             <span className="text-xs font-bold text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">Avg</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-4xl font-extrabold text-white mb-1">{metrics.avgResponseTime}d</h3>
            <p className="text-sm text-[var(--text-tertiary)] font-medium">Response Time</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300 relative group overflow-hidden">
           <div className="flex justify-between items-start mb-4">
             <div className="p-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
               <TrendingUp size={20} />
             </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-4xl font-extrabold text-white mb-1">{metrics.activeApps}</h3>
            <p className="text-sm text-[var(--text-tertiary)] font-medium">Active Applications</p>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: Applications Over Time */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 min-h-[350px]">
          <h3 className="text-lg font-bold text-white mb-1">Applications Over Time</h3>
          <p className="text-xs text-[var(--text-tertiary)] mb-6">Daily application activity vs Interviews</p>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={appOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} opacity={0.3} vertical={false} />
                <XAxis dataKey="name" stroke={COLORS.text} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={COLORS.text} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1F2E', border: '1px solid #2A3142', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="total" stroke={COLORS.primary} strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} name="Applications" />
                <Line type="monotone" dataKey="interviews" stroke={COLORS.secondary} strokeWidth={3} dot={{r: 4, strokeWidth: 2}} name="Interviews" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart: Response Rate Trend */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 min-h-[350px]">
          <h3 className="text-lg font-bold text-white mb-1">Response Rate Trend</h3>
          <p className="text-xs text-[var(--text-tertiary)] mb-6">Percentage of applications getting responses</p>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={responseRateData}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} opacity={0.3} vertical={false} />
                <XAxis dataKey="name" stroke={COLORS.text} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={COLORS.text} fontSize={12} tickLine={false} axisLine={false} unit="%" />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1A1F2E', border: '1px solid #2A3142', borderRadius: '8px' }}
                   itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="rate" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorRate)" strokeWidth={3} name="Response Rate" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart: Status Breakdown */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 min-h-[350px]">
          <h3 className="text-lg font-bold text-white mb-1">Status Breakdown</h3>
          <p className="text-xs text-[var(--text-tertiary)] mb-6">Current pipeline distribution</p>
          
          <div className="h-[220px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1A1F2E', border: '1px solid #2A3142', borderRadius: '8px' }}
                   itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="block text-2xl font-bold text-white">{metrics.totalApps}</span>
              <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide">Total</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            {statusData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[index] }}></div>
                <span>{entry.name}: <span className="font-bold text-white">{entry.value}</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: Top Companies */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 lg:col-span-2 min-h-[350px]">
          <h3 className="text-lg font-bold text-white mb-1">Top Companies</h3>
          <p className="text-xs text-[var(--text-tertiary)] mb-6">Most applied to companies</p>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companyData} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} opacity={0.3} horizontal={false} />
                <XAxis type="number" stroke={COLORS.text} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="white" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                   cursor={{fill: 'rgba(255,255,255,0.05)'}}
                   contentStyle={{ backgroundColor: '#1A1F2E', border: '1px solid #2A3142', borderRadius: '8px' }}
                   itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights Panel */}
      <div className="bg-gradient-to-br from-[rgba(62,207,142,0.05)] to-[rgba(62,207,142,0.02)] border border-[rgba(62,207,142,0.2)] rounded-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-[var(--green-500)] opacity-[0.03] blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 bg-[var(--green-500)] text-white rounded-xl shadow-lg shadow-[rgba(62,207,142,0.2)]">
            <Lightbulb size={24} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white">AI Insights & Recommendations</h3>
              <button 
                onClick={handleRefreshInsights}
                disabled={insightsLoading}
                className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--green-500)] transition-all disabled:opacity-50"
                title="Regenerate Insights"
              >
                <RefreshCw size={16} className={`text-[var(--text-secondary)] ${insightsLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-2xl">Based on your application data, here are some personalized tips.</p>
            
            {insightsLoading ? (
              <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm">Generating insights...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiInsights.map((insight, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-start gap-3 p-4 rounded-lg bg-[var(--bg-secondary)] border ${
                      insight.type === 'success' ? 'border-[rgba(62,207,142,0.2)]' :
                      insight.type === 'warning' ? 'border-[rgba(239,68,68,0.2)]' :
                      'border-[rgba(99,102,241,0.2)]'
                    }`}
                  >
                    {insight.type === 'success' ? (
                      <CheckCircle2 size={18} className="text-[var(--green-500)] mt-0.5 shrink-0" />
                    ) : insight.type === 'warning' ? (
                      <XCircle size={18} className="text-[var(--error)] mt-0.5 shrink-0" />
                    ) : (
                      <Clock size={18} className="text-[#6366F1] mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-bold text-white mb-1">{insight.title}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
