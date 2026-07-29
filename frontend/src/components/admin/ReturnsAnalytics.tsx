import React, { useState, useEffect } from 'react';
import { RotateCcw, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Clock, RefreshCw } from 'lucide-react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

export const ReturnsAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res: any = await adminService.getReturnAnalytics();
      setAnalytics(res.analytics);
    } catch {
      toast.error('Failed to load return analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 bg-white rounded-2xl border border-gray-100 p-6">
        <RefreshCw className="w-6 h-6 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-amber-500" /> Return Analytics Overview
          </h2>
          <p className="text-xs text-gray-500">Summary metrics of returns and refunds performance</p>
        </div>
        <button onClick={fetchAnalytics} className="p-2 rounded-lg hover:bg-gray-50">
          <RefreshCw className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
          <p className="text-xs font-medium text-amber-700">Total Return Requests</p>
          <p className="text-xl font-bold text-amber-900 mt-1">{analytics.total}</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
          <p className="text-xs font-medium text-blue-700">Pending Review</p>
          <p className="text-xl font-bold text-blue-900 mt-1">{analytics.pending}</p>
        </div>
        <div className="p-4 rounded-xl bg-green-50 border border-green-100">
          <p className="text-xs font-medium text-green-700">Total Refunded</p>
          <p className="text-xl font-bold text-green-900 mt-1">₹{analytics.totalRefundedAmount.toFixed(2)}</p>
        </div>
        <div className="p-4 rounded-xl bg-red-50 border border-red-100">
          <p className="text-xs font-medium text-red-700">Fraud Flagged</p>
          <p className="text-xl font-bold text-red-900 mt-1">{analytics.fraudFlagged}</p>
        </div>
      </div>

      {analytics.byReason?.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-600 mb-2">Top Return Reasons</h3>
          <div className="flex flex-wrap gap-2">
            {analytics.byReason.map((r: any) => (
              <span key={r.reason} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                {r.reason.replace('_', ' ')}: <strong className="text-gray-900">{r.count}</strong>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnsAnalytics;
