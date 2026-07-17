import React from 'react';
import { cn } from './AdminBadge';

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

interface AdminTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export const AdminTimeline: React.FC<AdminTimelineProps> = ({ events, className }) => {
  if (!events || events.length === 0) return null;

  return (
    <div className={cn("relative border-l border-outline-variant ml-3 space-y-8", className)}>
      {events.map((event, index) => (
        <div key={event.id} className="relative pl-6">
          <span 
            className={cn(
              "absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-background",
              event.isActive ? "bg-primary-container" : "bg-outline-variant"
            )}
          >
            {event.icon}
          </span>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
            <h4 className={cn(
              "text-sm font-medium",
              event.isActive ? "text-primary-container" : "text-on-secondary-container"
            )}>
              {event.title}
            </h4>
            <time className="mt-1 text-xs text-on-secondary-container/70 sm:mt-0 sm:ml-4">
              {event.date}
            </time>
          </div>
          {event.description && (
            <p className="mt-1 text-sm text-on-secondary-container">
              {event.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
