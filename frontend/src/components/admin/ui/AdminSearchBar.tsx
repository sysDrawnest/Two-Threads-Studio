import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface AdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const AdminSearchBar: React.FC<AdminSearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 400); // Debounce
    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3 h-4 w-4 text-on-secondary-container" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-outline-variant bg-background pl-9 pr-10 text-sm text-primary-container placeholder:text-on-secondary-container focus:border-on-secondary-container focus:outline-none focus:ring-1 focus:ring-on-secondary-container"
      />
      {localValue && (
        <button
          onClick={() => setLocalValue('')}
          className="absolute right-3 rounded-full p-1 text-on-secondary-container hover:bg-surface-container"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};
