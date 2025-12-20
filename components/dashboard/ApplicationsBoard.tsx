'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

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

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter matching applications (case-insensitive search)
  const filteredApplications = applications.filter(app => 
    (app.company?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (app.position?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

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
          <div ref={searchRef} className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] z-10" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(e.target.value.length > 0);
              }}
              onFocus={() => searchQuery.length > 0 && setShowDropdown(true)}
              placeholder="Search applications..." 
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-[var(--green-500)]"
            />
            
            {/* Dropdown Results */}
            {showDropdown && filteredApplications.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                {filteredApplications.slice(0, 8).map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      setSelectedApplication(app.id);
                      setSearchQuery('');
                      setShowDropdown(false);
                      // Scroll to application in view
                      document.getElementById(`app-${app.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-[var(--bg-tertiary)] transition-colors border-b border-[var(--border-subtle)] last:border-b-0 ${
                      selectedApplication === app.id ? 'bg-[var(--bg-tertiary)]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white truncate">{app.company}</div>
                        <div className="text-xs text-[var(--text-tertiary)] truncate">{app.position}</div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                        app.status === 'Applied' 
                          ? 'bg-blue-500/20 text-blue-400'
                          : app.status === 'Interview'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : app.status === 'Offer'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {app.status}
                      </div>
                    </div>
                  </button>
                ))}
                {filteredApplications.length > 8 && (
                  <div className="px-4 py-2 text-xs text-[var(--text-tertiary)] text-center bg-[var(--bg-tertiary)]">
                    +{filteredApplications.length - 8} more results
                  </div>
                )}
              </div>
            )}

            {/* No results message */}
            {showDropdown && searchQuery && filteredApplications.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg shadow-xl z-50 px-4 py-6 text-center">
                <p className="text-[var(--text-tertiary)] text-sm">No applications found</p>
              </div>
            )}
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
            applications={filteredApplications} 
            onStatusChange={handleStatusChange}
          />
        ) : (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Company</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Position</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Applied Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app, index) => (
                      <tr 
                        key={app.id}
                        id={`app-${app.id}`}
                        className={`border-b border-[var(--border-subtle)] hover:bg-[var(--bg-tertiary)] transition-colors ${
                          index % 2 === 0 ? 'bg-[var(--bg-primary)]' : 'bg-[var(--bg-secondary)]'
                        } ${selectedApplication === app.id ? 'ring-2 ring-[var(--green-500)]' : ''}`}
                      >
                        <td className="py-4 px-6">
                          <div className="font-semibold text-white">{app.company}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-[var(--text-secondary)]">{app.position}</div>
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border-none cursor-pointer transition-all ${
                              app.status === 'Applied' 
                                ? 'bg-blue-500/20 text-blue-400'
                                : app.status === 'Interview'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : app.status === 'Offer'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            <option value="Applied">Applied</option>
                            <option value="Interview">Interview</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-[var(--text-tertiary)] text-sm">
                            {new Date(app.applied_date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-[var(--text-secondary)] font-medium">
                            {app.salary || '—'}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              
              {/* Empty State */}
              {filteredApplications.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-[var(--text-tertiary)]">
                    {searchQuery ? 'No applications found matching your search.' : 'No applications yet. Add your first one!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
