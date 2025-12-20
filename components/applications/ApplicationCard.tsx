'use client';

import { useDraggable } from '@dnd-kit/core';
import { Building2, Calendar, DollarSign } from 'lucide-react';

interface Application {
  id: string;
  company: string;
  position: string;
  status: string;
  applied_date: string;
  salary?: string;
}

interface ApplicationCardProps {
  application: Application;
  isDragging?: boolean;
}

export default function ApplicationCard({ application, isDragging = false }: ApplicationCardProps) {
  const { attributes, listeners, setNodeRef, isDragging: isBeingDragged } = useDraggable({
    id: application.id,
  });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'N/A';
    }
  };

  // Hide original card when dragging (overlay shows instead)
  if (isBeingDragged) {
    return (
      <div
        ref={setNodeRef}
        className="bg-[var(--bg-tertiary)] border-2 border-dashed border-[var(--green-500)] rounded-lg p-4 opacity-40"
      >
        <div className="invisible">
          <div className="mb-3">
            <h4 className="font-semibold">{application.company}</h4>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`app-${application.id}`}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`
        bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg p-4
        cursor-grab active:cursor-grabbing select-none
        hover:border-[var(--green-500)] transition-all
        ${isDragging ? 'shadow-2xl ring-2 ring-[var(--green-500)] rotate-3' : 'hover:scale-[1.02]'}
      `}
    >
      {/* Company & Position */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <Building2 size={16} className="text-[var(--green-500)]" />
          <h4 className="font-semibold text-white truncate">{application.company}</h4>
        </div>
        <p className="text-sm text-[var(--text-secondary)] truncate">{application.position}</p>
      </div>

      {/* Meta Info */}
      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>{formatDate(application.applied_date)}</span>
        </div>
        {application.salary && (
          <div className="flex items-center gap-1 text-[var(--green-500)]">
            <DollarSign size={12} />
            <span>{application.salary}</span>
          </div>
        )}
      </div>
    </div>
  );
}
