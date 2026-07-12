import React from 'react';

interface EmptyStateProps {
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionText,
  onAction,
}) => {
  return (
    <div className="border border-dashed border-zinc-300 p-8 text-center bg-zinc-50 flex flex-col items-center justify-center min-h-[200px]">
      <h4 className="font-serif text-lg text-zinc-800 font-medium mb-2">{title}</h4>
      <p className="text-sm text-zinc-500 max-w-sm mb-6">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 border border-zinc-800 text-xs font-mono uppercase tracking-widest text-zinc-900 hover:bg-zinc-900 hover:text-white transition-all duration-300"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
