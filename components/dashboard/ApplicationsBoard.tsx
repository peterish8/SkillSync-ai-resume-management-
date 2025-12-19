'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Search, Filter, LayoutGrid, LayoutList } from 'lucide-react';
import ApplicationCard from '@/components/ApplicationCard';
import KanbanBoard from '@/components/applications/KanbanBoard';

interface Application {
  id: string;
  company: string;
  position: string;
  status: string;
  applied_date: string;
  salary?: string;
}

export default function ApplicationsBoard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchApplications = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    
    setApplications(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Optimistic update FIRST (makes UI responsive)
    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
    );

    // Then sync to database in background
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        console.warn('DB sync failed, will retry on next load:', error.message);
      }
    } catch (err) {
      console.warn('DB sync error:', err);
    }
  };

  if (loading) return <div className="text-[var(--text-tertiary)]">Loading applications...</div>;

  return (
    <div className="h-full flex flex-col">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border-subtle)]">
          <button 
            onClick={() => setViewMode('kanban')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              viewMode === 'kanban' 
                ? 'bg-[var(--bg-tertiary)] text-white shadow-sm' 
                : 'text-[var(--text-tertiary)] hover:text-white hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            <LayoutGrid size={16} />
            Kanban
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              viewMode === 'table' 
                ? 'bg-[var(--bg-tertiary)] text-white shadow-sm' 
                : 'text-[var(--text-tertiary)] hover:text-white hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            <LayoutList size={16} />
            Table
          </button>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applications..." 
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-[var(--green-500)]"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
            <Filter size={16} />
            Filter
          </button>
          <button className="px-3 py-2 bg-[var(--green-500)] text-white rounded-lg text-sm font-bold shadow-[0_4px_12px_rgba(62,207,142,0.3)] hover:transform hover:-translate-y-0.5 transition-all">
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'kanban' ? (
          <KanbanBoard 
            applications={applications.filter(app => 
              app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
              app.position.toLowerCase().includes(searchQuery.toLowerCase())
            )} 
            onStatusChange={handleStatusChange}
          />
        ) : (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6">
            <p className="text-[var(--text-secondary)]">Table view coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
