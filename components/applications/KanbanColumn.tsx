'use client';

import { useDroppable } from '@dnd-kit/core';
import ApplicationCard from './ApplicationCard';

interface Application {
  id: string;
  company: string;
  position: string;
  status: string;
  applied_date: string;
  salary?: string;
}

interface KanbanColumnProps {
  id: string;
  label: string;
  color: string;
  applications: Application[];
}

export default function KanbanColumn({ id, label, color, applications }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col w-full">
      {/* Column Header */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <h3 className="font-semibold text-white">{label}</h3>
        <span className="ml-auto text-sm text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">
          {applications.length}
        </span>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={`
          flex flex-col gap-3 min-h-[300px] p-3 rounded-xl
          bg-[var(--bg-secondary)] border-2 transition-all
          ${isOver 
            ? 'border-[var(--green-500)] bg-[rgba(62,207,142,0.1)]' 
            : 'border-transparent'
          }
        `}
      >
        {applications.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))}
        {applications.length === 0 && (
          <div className="text-center text-[var(--text-tertiary)] py-8 text-sm border-2 border-dashed border-[var(--border-subtle)] rounded-lg">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}

