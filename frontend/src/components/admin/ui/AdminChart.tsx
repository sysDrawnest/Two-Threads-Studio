import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';
import { cn } from './AdminBadge';

interface ChartData {
  [key: string]: string | number;
}

interface AdminChartProps {
  data: ChartData[];
  type?: 'bar' | 'area';
  xAxisKey: string;
  series: {
    key: string;
    color?: string;
    name?: string;
  }[];
  height?: number;
  className?: string;
  valueFormatter?: (value: number) => string;
}

export const AdminChart: React.FC<AdminChartProps> = ({
  data,
  type = 'bar',
  xAxisKey,
  series,
  height = 300,
  className,
  valueFormatter,
}) => {
  const defaultColors = ['#2d2520', '#785d4b', '#d1c4bd'];

  const renderTooltipFormatter = (value: any, name: any) => {
    if (valueFormatter && typeof value === 'number') {
      return [valueFormatter(value), name];
    }
    return [value, name];
  };

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {type === 'bar' ? (
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1c4bd" opacity={0.3} />
            <XAxis 
              dataKey={xAxisKey} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#785d4b' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#785d4b' }}
              tickFormatter={valueFormatter}
            />
            <Tooltip 
              cursor={{ fill: '#f2ede8' }}
              contentStyle={{ 
                backgroundColor: '#fef8f3', 
                border: '1px solid #d1c4bd',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                color: '#2d2520',
                fontSize: '12px'
              }}
              formatter={renderTooltipFormatter}
            />
            {series.map((s, i) => (
              <Bar 
                key={s.key} 
                dataKey={s.key} 
                name={s.name || s.key} 
                fill={s.color || defaultColors[i % defaultColors.length]} 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            ))}
          </BarChart>
        ) : (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {series.map((s, i) => (
                <linearGradient key={`grad-${s.key}`} id={`color-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color || defaultColors[i % defaultColors.length]} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={s.color || defaultColors[i % defaultColors.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1c4bd" opacity={0.3} />
            <XAxis 
              dataKey={xAxisKey} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#785d4b' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#785d4b' }}
              tickFormatter={valueFormatter}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fef8f3', 
                border: '1px solid #d1c4bd',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                color: '#2d2520',
                fontSize: '12px'
              }}
              formatter={renderTooltipFormatter}
            />
            {series.map((s, i) => (
              <Area 
                key={s.key}
                type="monotone" 
                dataKey={s.key} 
                name={s.name || s.key}
                stroke={s.color || defaultColors[i % defaultColors.length]} 
                fillOpacity={1} 
                fill={`url(#color-${s.key})`} 
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
