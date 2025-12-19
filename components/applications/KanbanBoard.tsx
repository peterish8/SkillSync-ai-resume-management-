'use client';

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, rectIntersection, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import ApplicationCard from './ApplicationCard';

interface Application {
  id: string;
  company: string;
  position: string;
  status: string;
  applied_date: string;
  salary?: string;
}

interface KanbanBoardProps {
  applications: Application[];
  onStatusChange: (id: string, newStatus: string) => Promise<void>;
}

const STATUS_COLUMNS = [
  { id: 'Applied', label: 'Applied', color: 'bg-blue-500' },
  { id: 'Interview', label: 'Interview', color: 'bg-yellow-500' },
  { id: 'Offer', label: 'Offer', color: 'bg-green-500' },
  { id: 'Rejected', label: 'Rejected', color: 'bg-red-500' }
];

export default function KanbanBoard({ applications, onStatusChange }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Configure pointer sensor with activation constraint
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Lower distance for easier drag start
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;

    const applicationId = active.id as string;
    const overId = over.id as string;

    // Find which column was dropped on
    // Check if dropped directly on column OR on a card within a column
    let targetStatus: string | null = null;

    // First check if it's a column
    const column = STATUS_COLUMNS.find(col => col.id === overId);
    if (column) {
      targetStatus = column.id;
    } else {
      // It might be dropped on another card, find that card's column
      const overApp = applications.find(app => app.id === overId);
      if (overApp) {
        targetStatus = overApp.status;
      }
    }

    if (!targetStatus) return;

    // Find the application to check if status actually changed
    const app = applications.find(a => a.id === applicationId);
    if (app && app.status !== targetStatus) {
      console.log(`Moving ${app.company} from ${app.status} to ${targetStatus}`);
      await onStatusChange(applicationId, targetStatus);
    }
  };

  const getApplicationsByStatus = (status: string) => {
    return applications.filter(app => app.status === status);
  };

  const activeApplication = activeId 
    ? applications.find(app => app.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-2 gap-4 pb-4">
        {STATUS_COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            label={column.label}
            color={column.color}
            applications={getApplicationsByStatus(column.id)}
          />
        ))}
      </div>

      {/* This is the visual drag overlay that follows cursor */}
      <DragOverlay dropAnimation={{ duration: 150, easing: 'ease-out' }}>
        {activeApplication ? (
          <div className="opacity-95 shadow-2xl pointer-events-none">
            <ApplicationCard application={activeApplication} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

