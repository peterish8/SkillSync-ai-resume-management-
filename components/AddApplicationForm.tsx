'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Loader2 } from 'lucide-react';

interface AddApplicationFormProps {
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

export default function AddApplicationForm({ onClose, onSuccess, userId }: AddApplicationFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          user_id: userId,
          company: formData.company,
          role: formData.role,
          status: formData.status,
          notes: formData.notes,
          applied_date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error adding application:', error);
      alert('Failed to add application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl max-w-md w-full p-6 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-tertiary)] hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">Track New Application</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Company name</label>
            <input
              type="text"
              required
              placeholder="e.g., Stripe"
              className="w-full bg-[var(--bg-input)] border border-[var(--border-medium)] rounded-lg px-4 py-2.5 text-white placeholder-[var(--text-disabled)] focus:outline-none focus:border-[var(--green-500)] focus:ring-1 focus:ring-[var(--green-500)] transition-all"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Job role</label>
            <input
              type="text"
              required
              placeholder="e.g., Frontend Developer"
              className="w-full bg-[var(--bg-input)] border border-[var(--border-medium)] rounded-lg px-4 py-2.5 text-white placeholder-[var(--text-disabled)] focus:outline-none focus:border-[var(--green-500)] focus:ring-1 focus:ring-[var(--green-500)] transition-all"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Current status</label>
            <select
              className="w-full bg-[var(--bg-input)] border border-[var(--border-medium)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--green-500)] focus:ring-1 focus:ring-[var(--green-500)] transition-all cursor-pointer"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Notes <span className="text-[var(--text-tertiary)] font-normal">(optional)</span>
            </label>
            <textarea
              className="w-full bg-[var(--bg-input)] border border-[var(--border-medium)] rounded-lg px-4 py-2.5 text-white placeholder-[var(--text-disabled)] focus:outline-none focus:border-[var(--green-500)] focus:ring-1 focus:ring-[var(--green-500)] transition-all resize-none"
              rows={3}
              placeholder="Link to job post, recruiter name, etc."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors border border-transparent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-bold text-white bg-[var(--green-500)] rounded-lg hover:bg-[var(--green-400)] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_12px_rgba(62,207,142,0.3)] hover:shadow-[0_6px_16px_rgba(62,207,142,0.4)] flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Adding...
                </>
              ) : (
                'Add Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
