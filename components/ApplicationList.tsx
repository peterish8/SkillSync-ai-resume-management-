'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import ApplicationCard from './ApplicationCard';
import AddApplicationForm from './AddApplicationForm';
import { Plus, Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Application {
  id: string;
  company: string;
  role: string;
  status: string;
  notes: string;
  applied_date: string;
}

export default function ApplicationList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUserId(session.user.id);

      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(4); // Show recent 4

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  if (loading) {
    return <div className="text-[var(--text-tertiary)] text-sm py-8 animate-pulse">Loading recent applications...</div>;
  }

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
           <div className="p-2 rounded-lg bg-[rgba(99,102,241,0.1)] text-[var(--status-applied)]">
             <Briefcase size={20} />
           </div>
           <h3 className="text-lg font-bold text-white">Recent Applications</h3>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="group flex items-center gap-2 px-3 py-2 bg-[var(--green-500)] text-white rounded-lg text-sm font-bold hover:bg-[var(--green-400)] transition-all shadow-[0_4px_12px_rgba(62,207,142,0.3)] hover:shadow-[0_6px_16px_rgba(62,207,142,0.4)] transform hover:-translate-y-0.5"
        >
          <Plus size={16} strokeWidth={3} />
          <span className="hidden sm:inline">Add New</span>
        </button>
      </div>

      <div className="flex-1">
        {applications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--bg-tertiary)]/30">
            <p className="text-sm text-[var(--text-secondary)] mb-1 font-medium">
              No active applications
            </p>
            <p className="text-xs text-[var(--text-tertiary)] mb-5 max-w-[200px]">
              Start tracking your job search journey today.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs font-semibold text-[var(--green-500)] hover:text-[var(--green-400)]"
            >
              + Add your first application
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <ApplicationCard 
                key={app.id} 
                app={app} 
                onUpdate={fetchApplications} 
              />
            ))}
          </div>
        )}
      </div>
      
      {applications.length > 0 && (
        <div className="pt-6 mt-2 border-t border-[var(--border-subtle)] flex justify-end">
          <Link 
            href="/dashboard/applications" 
            className="text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--green-500)] flex items-center gap-1 transition-colors"
          >
            View all applications <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {showAddModal && userId && (
        <AddApplicationForm 
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchApplications();
          }}
          userId={userId}
        />
      )}
    </div>
  );
}
