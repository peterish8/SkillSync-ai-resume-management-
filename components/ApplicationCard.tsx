'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MoreHorizontal, Calendar, Trash2, Edit2, Building2 } from 'lucide-react';

interface Application {
  id: string;
  company: string;
  role: string;
  status: string;
  notes: string;
  applied_date: string;
}

interface ApplicationCardProps {
  app: Application;
  onUpdate: () => void;
}

const statusConfig: Record<string, { color: string; bg: string; border: string }> = {
  Applied: { color: 'var(--status-applied)', bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.3)' },
  Interview: { color: 'var(--status-interview)', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)' },
  Offer: { color: 'var(--status-offer)', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)' },
  Rejected: { color: 'var(--status-rejected)', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)' },
  'Not selected': { color: 'var(--status-rejected)', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)' } // Legacy mapping
};

export default function ApplicationCard({ app, onUpdate }: ApplicationCardProps) {
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', app.id);
      
      if (error) throw error;
      onUpdate();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this application?')) return;
    
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', app.id);
      
      if (error) throw error;
      onUpdate();
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const statusStyle = statusConfig[app.status] || statusConfig['Applied'];

  return (
    <div className="group bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl p-5 hover:transform hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:border-[var(--green-500)]/30 transition-all duration-300 relative">
      <div className="flex justify-between items-start gap-4">
        {/* Company Icon & Info */}
        <div className="flex gap-4 min-w-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-input)] border border-[var(--border-medium)] flex items-center justify-center text-white font-bold text-lg shadow-inner">
             {app.company.substring(0, 2).toUpperCase()}
          </div>
          
          <div className="min-w-0">
            <h4 className="text-lg font-bold text-white truncate leading-tight mb-1">{app.company}</h4>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Building2 size={14} className="text-[var(--text-tertiary)]" />
              <span className="truncate">{app.role}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="relative">
          <select
            value={app.status === 'Not selected' ? 'Rejected' : app.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating}
            className="appearance-none text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--border-medium)] transition-all uppercase tracking-wider"
            style={{ 
              backgroundColor: statusStyle.bg, 
              color: statusStyle.color,
              border: `1px solid ${statusStyle.border}`
            }}
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Meta Info */}
      <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] font-medium">
          <Calendar size={14} />
          <span>Applied: {new Date(app.applied_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        
        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
           <button className="text-[var(--text-tertiary)] hover:text-white transition-colors" title="Edit">
             <Edit2 size={16} />
           </button>
           <button 
             onClick={handleDelete}
             className="text-[var(--text-tertiary)] hover:text-[var(--error)] transition-colors"
             title="Delete"
           >
             <Trash2 size={16} />
           </button>
        </div>
      </div>
    </div>
  );
}
