import React, { useState, useEffect, useCallback } from 'react';
import {
  RotateCcw, Search, Filter, ChevronRight, AlertTriangle,
  CheckCircle, XCircle, Package, Eye, RefreshCw, ArrowLeft,
  Clock, Star, Shield, Camera, Truck
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';
import { ReturnsAnalytics } from '../../components/admin/ReturnsAnalytics';

const RETURN_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  REQUESTED:          { label: 'Pending Review',       color: 'bg-yellow-100 text-yellow-800' },
  APPROVED:           { label: 'Approved',              color: 'bg-blue-100 text-blue-800' },
  PICKUP_SCHEDULED:   { label: 'Pickup Scheduled',     color: 'bg-blue-100 text-blue-800' },
  PICKED_UP:          { label: 'Picked Up',            color: 'bg-indigo-100 text-indigo-800' },
  IN_TRANSIT:         { label: 'In Transit',           color: 'bg-purple-100 text-purple-800' },
  RECEIVED:           { label: 'Received',             color: 'bg-purple-100 text-purple-800' },
  INSPECTION_PENDING: { label: 'Inspection Pending',  color: 'bg-orange-100 text-orange-800' },
  INSPECTION_PASSED:  { label: 'Inspection Passed',   color: 'bg-green-100 text-green-800' },
  INSPECTION_FAILED:  { label: 'Inspection Failed',   color: 'bg-red-100 text-red-800' },
  REFUND_PROCESSING:  { label: 'Refund Processing',   color: 'bg-blue-100 text-blue-800' },
  REFUNDED:           { label: 'Refunded',             color: 'bg-green-100 text-green-800' },
  REJECTED:           { label: 'Rejected',             color: 'bg-red-100 text-red-800' },
  CLOSED:             { label: 'Closed',               color: 'bg-gray-100 text-gray-600' },
};

const RETURN_REASON_LABELS: Record<string, string> = {
  DAMAGED: 'Arrived Damaged',
  WRONG_PRODUCT: 'Wrong Product',
  DEFECTIVE: 'Defective',
  NOT_AS_DESCRIBED: 'Not As Described',
  SIZE_ISSUE: 'Size Issue',
  COLOR_DIFFERENCE: 'Color Difference',
  QUALITY_ISSUE: 'Quality Issue',
  MISSING_PARTS: 'Missing Parts',
  CHANGED_MIND: 'Changed Mind',
  OTHER: 'Other',
};

export const ReturnsManagement: React.FC = () => {
  const [returns, setReturns] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [fraudFilter, setFraudFilter] = useState('');
  const [selectedReturn, setSelectedReturn] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Action modal state
  const [actionModal, setActionModal] = useState<'approve' | 'reject' | 'inspect' | null>(null);
  const [actionNote, setActionNote] = useState('');
  const [actionAmount, setActionAmount] = useState('');
  const [inspectPassed, setInspectPassed] = useState(true);
  const [inspectDisposition, setInspectDisposition] = useState('RESTOCK');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReturns = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await adminService.listReturnRequests({
        status: statusFilter || undefined,
        fraudFlagged: fraudFilter === 'fraud' ? true : undefined,
        search: search || undefined,
        page,
        limit: 20,
      });
      setReturns(res.requests || []);
      setTotal(res.total || 0);
    } catch {
      toast.error('Failed to load returns');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, fraudFilter, search, page]);

  useEffect(() => { fetchReturns(); }, [fetchReturns]);

  const openDetail = async (returnId: string) => {
    setDetailLoading(true);
    try {
      const res: any = await adminService.getReturnRequest(returnId);
      setSelectedReturn(res.returnRequest);
    } catch {
      toast.error('Failed to load return details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedReturn) return;
    setActionLoading(true);
    try {
      if (actionModal === 'approve') {
        await adminService.approveReturn(selectedReturn.id, {
          note: actionNote,
          approvedAmount: actionAmount ? parseFloat(actionAmount) : undefined,
        });
        toast.success('Return approved');
      } else if (actionModal === 'reject') {
        await adminService.rejectReturn(selectedReturn.id, actionNote);
        toast.success('Return rejected');
      } else if (actionModal === 'inspect') {
        await adminService.recordReturnInspection(selectedReturn.id, {
          passed: inspectPassed,
          disposition: inspectDisposition,
          note: actionNote,
          adjustedAmount: actionAmount ? parseFloat(actionAmount) : undefined,
        });
        toast.success(inspectPassed ? 'Inspection passed — refund processing' : 'Inspection failed recorded');
      }
      setActionModal(null);
      setActionNote('');
      setActionAmount('');
      const res: any = await adminService.getReturnRequest(selectedReturn.id);
      setSelectedReturn(res.returnRequest);
      fetchReturns();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStageAction = async (action: string) => {
    if (!selectedReturn) return;
    setActionLoading(true);
    try {
      if (action === 'picked-up') await adminService.markReturnPickedUp(selectedReturn.id);
      if (action === 'received') await adminService.markReturnReceived(selectedReturn.id);
      toast.success('Status updated');
      const res: any = await adminService.getReturnRequest(selectedReturn.id);
      setSelectedReturn(res.returnRequest);
      fetchReturns();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      {/* Left: Returns list */}
      <div className={`flex flex-col ${selectedReturn ? 'w-[420px] border-r border-gray-100' : 'flex-1'} bg-white`}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          {!selectedReturn && <ReturnsAnalytics />}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Returns</h1>
              <p className="text-sm text-gray-500">{total} total requests</p>
            </div>
            <button onClick={fetchReturns} className="p-2 rounded-lg hover:bg-gray-50"><RefreshCw className="w-4 h-4 text-gray-500" /></button>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search order # or customer..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
            >
              <option value="">All Status</option>
              {Object.entries(RETURN_STATUS_LABELS).map(([v, { label }]) => (
                <option key={v} value={v}>{label}</option>
              ))}
            </select>
            <select
              value={fraudFilter}
              onChange={e => setFraudFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
            >
              <option value="">All</option>
              <option value="fraud">🚨 Fraud Flagged</option>
            </select>
          </div>
        </div>

        {/* Returns list */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <RefreshCw className="w-6 h-6 text-amber-500 animate-spin" />
            </div>
          ) : returns.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <RotateCcw className="w-8 h-8 mb-2" />
              <p className="text-sm">No return requests found</p>
            </div>
          ) : returns.map(r => {
            const statusInfo = RETURN_STATUS_LABELS[r.status] || { label: r.status, color: 'bg-gray-100 text-gray-600' };
            return (
              <button
                key={r.id}
                onClick={() => openDetail(r.id)}
                className={`w-full text-left px-6 py-4 hover:bg-amber-50 transition-colors ${
                  selectedReturn?.id === r.id ? 'bg-amber-50 border-l-2 border-amber-500' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">{r.order?.orderNumber}</span>
                      {r.fraudFlagged && <span className="text-xs text-red-500">🚨 Flagged</span>}
                      {r.autoApproved && <span className="text-xs text-green-600">⚡ Auto-approved</span>}
                    </div>
                    <p className="text-xs text-gray-500">{r.user?.firstName} {r.user?.lastName}</p>
                    <p className="text-xs text-gray-400">{RETURN_REASON_LABELS[r.reason] || r.reason} · {r.items?.length} item(s)</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
                    <span className="text-xs text-gray-400">₹{Number(r.requestedAmount || 0).toFixed(0)}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Detail panel */}
      {selectedReturn && (
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {detailLoading ? (
            <div className="flex items-center justify-center h-full">
              <RefreshCw className="w-6 h-6 text-amber-500 animate-spin" />
            </div>
          ) : (
            <div className="max-w-2xl mx-auto p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedReturn(null)} className="p-1 rounded-lg hover:bg-gray-200">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">Return #{selectedReturn.order?.orderNumber}</h2>
                  <p className="text-sm text-gray-500">{selectedReturn.user?.firstName} {selectedReturn.user?.lastName} · {selectedReturn.user?.email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  (RETURN_STATUS_LABELS[selectedReturn.status] || { color: 'bg-gray-100 text-gray-600' }).color
                }`}>{(RETURN_STATUS_LABELS[selectedReturn.status] || { label: selectedReturn.status }).label}</span>
              </div>

              {/* Fraud warning */}
              {selectedReturn.fraudFlagged && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Fraud Alert</p>
                    <p className="text-xs text-red-600 mt-0.5">{selectedReturn.fraudReason}</p>
                  </div>
                </div>
              )}

              {/* Return details */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Return Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Reason:</span> <span className="font-medium">{RETURN_REASON_LABELS[selectedReturn.reason] || selectedReturn.reason}</span></div>
                  <div><span className="text-gray-500">Refund type:</span> <span className="font-medium">{selectedReturn.refundType?.replace('_', ' ')}</span></div>
                  <div><span className="text-gray-500">Requested:</span> <span className="font-medium">₹{Number(selectedReturn.requestedAmount || 0).toFixed(2)}</span></div>
                  {selectedReturn.approvedAmount && <div><span className="text-gray-500">Approved:</span> <span className="font-medium text-green-700">₹{Number(selectedReturn.approvedAmount).toFixed(2)}</span></div>}
                  {selectedReturn.finalRefundAmount && <div><span className="text-gray-500">Final refund:</span> <span className="font-medium text-green-700">₹{Number(selectedReturn.finalRefundAmount).toFixed(2)}</span></div>}
                  {selectedReturn.autoApproved && <div className="col-span-2"><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">⚡ Auto-approved: {selectedReturn.autoApproveRule}</span></div>}
                </div>
                {selectedReturn.notes && <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{selectedReturn.notes}</p>}
              </div>

              {/* Items */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Return Items</h3>
                <div className="space-y-3">
                  {selectedReturn.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.orderItem?.productImage} alt={item.orderItem?.productName} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.orderItem?.productName}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} · ₹{Number(item.unitPrice).toFixed(2)} each</p>
                        {Number(item.proratedDiscount) > 0 && <p className="text-xs text-orange-600">Coupon proration: −₹{Number(item.proratedDiscount).toFixed(2)}</p>}
                      </div>
                      <span className="text-sm font-medium text-green-700">₹{Number(item.refundableAmount).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence */}
              {selectedReturn.mediaUrls?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Evidence</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedReturn.mediaUrls.map((url: string, i: number) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                        <img src={url} alt={`Evidence ${i + 1}`} className="w-full h-24 object-cover rounded-lg border" onError={e => { (e.target as any).src = ''; }} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              {selectedReturn.timeline?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Return Timeline</h3>
                  <div className="space-y-3">
                    {selectedReturn.timeline.map((event: any, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-700">{(RETURN_STATUS_LABELS[event.status] || { label: event.status }).label}</p>
                          {event.note && <p className="text-xs text-gray-500">{event.note}</p>}
                          <p className="text-xs text-gray-400">{new Date(event.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Actions</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedReturn.status === 'REQUESTED' && (
                    <>
                      <button onClick={() => { setActionModal('approve'); setActionAmount(String(Number(selectedReturn.requestedAmount).toFixed(2))); }} className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700">
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button onClick={() => setActionModal('reject')} className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 border border-red-200 text-sm rounded-xl hover:bg-red-100">
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </>
                  )}
                  {selectedReturn.status === 'APPROVED' && (
                    <button onClick={() => handleStageAction('picked-up')} disabled={actionLoading} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 disabled:opacity-50">
                      <Truck className="w-4 h-4" /> Mark Picked Up
                    </button>
                  )}
                  {['PICKED_UP', 'IN_TRANSIT'].includes(selectedReturn.status) && (
                    <button onClick={() => handleStageAction('received')} disabled={actionLoading} className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white text-sm rounded-xl hover:bg-purple-700 disabled:opacity-50">
                      <Package className="w-4 h-4" /> Mark Received
                    </button>
                  )}
                  {selectedReturn.status === 'INSPECTION_PENDING' && (
                    <button onClick={() => setActionModal('inspect')} className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white text-sm rounded-xl hover:bg-amber-700">
                      <Eye className="w-4 h-4" /> Record Inspection
                    </button>
                  )}
                  {selectedReturn.status === 'INSPECTION_FAILED' && (
                    <button onClick={() => setActionModal('reject')} className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 border border-red-200 text-sm rounded-xl">
                      <XCircle className="w-4 h-4" /> Close & Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              {actionModal === 'approve' ? 'Approve Return' : actionModal === 'reject' ? 'Reject Return' : 'Record Inspection'}
            </h3>

            {actionModal === 'inspect' && (
              <div className="mb-4 space-y-3">
                <div className="flex gap-3">
                  <button onClick={() => setInspectPassed(true)} className={`flex-1 py-2 rounded-xl border text-sm font-medium ${inspectPassed ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'}`}>✅ Passed</button>
                  <button onClick={() => setInspectPassed(false)} className={`flex-1 py-2 rounded-xl border text-sm font-medium ${!inspectPassed ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600'}`}>❌ Failed</button>
                </div>
                {inspectPassed && (
                  <select value={inspectDisposition} onChange={e => setInspectDisposition(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm">
                    <option value="RESTOCK">📦 Restock inventory</option>
                    <option value="DAMAGED">🔴 Damaged — no restock</option>
                    <option value="REPAIR">🔧 Send for repair</option>
                    <option value="DISPOSE">🗑️ Dispose</option>
                    <option value="QUALITY_CHECK">🔍 Further quality check</option>
                  </select>
                )}
              </div>
            )}

            {(actionModal === 'approve' || actionModal === 'inspect') && inspectPassed && (
              <div className="mb-3">
                <label className="text-xs text-gray-500 mb-1 block">Refund Amount (₹)</label>
                <input type="number" value={actionAmount} onChange={e => setActionAmount(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
              </div>
            )}

            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">
                {actionModal === 'reject' ? 'Rejection reason (required)' : 'Note (optional)'}
              </label>
              <textarea value={actionNote} onChange={e => setActionNote(e.target.value)} rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none" placeholder={actionModal === 'reject' ? 'Explain why the return was rejected...' : 'Optional note...'} />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setActionModal(null)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm">Cancel</button>
              <button
                onClick={handleAction}
                disabled={actionLoading || (actionModal === 'reject' && actionNote.length < 10)}
                className={`flex-1 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-50 ${
                  actionModal === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                  actionModal === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {actionLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnsManagement;
