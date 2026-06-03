import React from 'react';
import { revenueChartData, popularProducts, dashboardStats } from '../../data/adminData';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const membershipGrowth = [120, 180, 240, 310, 400, 490, 623];
const tutorialEngagement = [
  { course: 'Botanical Thread Painting', students: 1240, completion: 72 },
  { course: 'Beginner Hoop Essentials', students: 2860, completion: 88 },
  { course: 'Advanced Silk Shading', students: 480, completion: 55 },
  { course: 'Heritage Stitch Patterns', students: 660, completion: 63 },
];

// Bar chart utility
const BarChart: React.FC<{ data: { label: string; value: number }[], color?: string }> = ({ data, color = 'bg-primary-container' }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="flex items-end gap-2 h-36 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div className={`w-full ${color} hover:opacity-80 transition-opacity rounded-sm`} style={{ height: `${(d.value / max) * 100}%`, minHeight: 4 }} title={`${d.label}: ${d.value}`} />
          <span className="font-sans text-[10px] text-on-surface-variant">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl font-light text-primary-container">Analytics</h1>
        <p className="font-sans text-sm text-on-surface-variant mt-1">Performance insights for TwoThreads Studio.</p>
      </div>

      {/* Revenue Chart */}
      <div className="bg-background border border-outline-variant p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-serif text-xl text-primary-container">Revenue Overview</h2>
            <p className="font-sans text-xs text-on-surface-variant mt-1">Last 7 months</p>
          </div>
          <div className="text-right">
            <p className="font-serif text-3xl text-primary-container">${(dashboardStats.totalRevenue / 1000).toFixed(1)}k</p>
            <p className="font-sans text-xs text-[#3a6b3a]">↑ {dashboardStats.revenueGrowth}% vs last period</p>
          </div>
        </div>
        <BarChart data={revenueChartData.map(d => ({ label: d.month, value: d.revenue }))} />
      </div>

      {/* Two-column charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membership Growth */}
        <div className="bg-background border border-outline-variant p-6">
          <h2 className="font-serif text-xl text-primary-container mb-1">Membership Growth</h2>
          <p className="font-sans text-xs text-on-surface-variant mb-6">Active subscribers over 7 months</p>
          <BarChart data={membershipGrowth.map((v, i) => ({ label: months[i], value: v }))} color="bg-on-secondary-container" />
        </div>

        {/* Product Performance */}
        <div className="bg-background border border-outline-variant p-6">
          <h2 className="font-serif text-xl text-primary-container mb-1">Product Performance</h2>
          <p className="font-sans text-xs text-on-surface-variant mb-6">Sales by product</p>
          <div className="flex flex-col gap-4">
            {popularProducts.map((p, i) => {
              const maxRevenue = popularProducts[0].revenue;
              return (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-sans text-xs text-on-surface-variant truncate max-w-[50%]">{p.name}</span>
                    <span className="font-sans text-xs font-medium text-primary-container">${p.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 w-full bg-outline-variant rounded-full overflow-hidden">
                    <div className="h-full bg-primary-container" style={{ width: `${(p.revenue / maxRevenue) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tutorial Engagement */}
      <div className="bg-background border border-outline-variant p-6">
        <h2 className="font-serif text-xl text-primary-container mb-6">Tutorial Engagement</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutorialEngagement.map((t, i) => (
            <div key={i} className="bg-surface-container p-4">
              <p className="font-sans text-xs text-on-surface-variant mb-3 line-clamp-2 h-8">{t.course}</p>
              <p className="font-serif text-2xl text-primary-container mb-1">{t.students.toLocaleString()}</p>
              <p className="font-sans text-xs text-on-surface-variant mb-3">students enrolled</p>
              <div>
                <div className="flex justify-between font-sans text-[10px] text-on-surface-variant mb-1">
                  <span>Completion Rate</span>
                  <span>{t.completion}%</span>
                </div>
                <div className="h-1 w-full bg-outline-variant rounded-full overflow-hidden">
                  <div className="h-full bg-on-secondary-container" style={{ width: `${t.completion}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Avg Order Value', value: `$${Math.round(dashboardStats.totalRevenue / dashboardStats.totalOrders)}` },
          { label: 'Conversion Rate', value: '3.8%' },
          { label: 'Return Rate', value: '94.2%' },
          { label: 'Active Members', value: dashboardStats.activeMembers.toLocaleString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-background border border-outline-variant p-5 text-center">
            <p className="font-serif text-2xl text-primary-container">{value}</p>
            <p className="font-sans text-xs uppercase tracking-widest text-on-surface-variant mt-2">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
