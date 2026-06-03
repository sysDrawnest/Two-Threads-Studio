import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  growth?: number;
  icon: React.ReactNode;
  prefix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, growth, icon, prefix = '' }) => {
  const isPositive = growth !== undefined && growth >= 0;
  return (
    <div className="bg-background border border-outline-variant p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <p className="font-sans text-xs uppercase tracking-widest text-on-surface-variant">{label}</p>
        <div className="w-10 h-10 bg-inverse-on-surface flex items-center justify-center text-primary-container">
          {icon}
        </div>
      </div>
      <div>
        <p className="font-serif text-3xl font-light text-primary-container">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {growth !== undefined && (
          <p className={`font-sans text-xs mt-1 ${isPositive ? 'text-[#3a6b3a]' : 'text-error'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(growth)}% vs last month
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
