import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, User, CreditCard, Clock, CheckCircle, Truck, FileText, Printer, RotateCcw, X } from 'lucide-react';
import { useAdminOrderDetail, useUpdateOrderStatus } from '../../hooks/useAdminData';
import { AdminBadge, AdminSkeleton, AdminTimeline } from '../../components/admin/ui';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: orderResponse, isLoading, refetch } = useAdminOrderDetail(id!);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();
  
  const [note, setNote] = useState('');
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [isRefunding, setIsRefunding] = useState(false);

  const order = orderResponse?.order || orderResponse?.data;

  if (isLoading) {
    return <AdminSkeleton className="h-[600px] w-full" />;
  }

  if (!order) {
    return <div className="text-error">Order not found</div>;
  }


  const handleStatusChange = (newStatus: string) => {
    updateStatus({ id: order.id, status: newStatus, note });
    setNote('');
  };

  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order.payment?.id && !order.paymentId) {
      toast.error('No valid payment record found for this order');
      return;
    }

    const paymentId = order.payment?.id || order.paymentId;
    const amount = parseFloat(refundAmount) || Number(order.grandTotal);

    try {
      setIsRefunding(true);
      await adminService.processRefund(paymentId, { amount, reason: refundReason });
      toast.success('Refund processed successfully');
      setIsRefundModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to process refund');
    } finally {
      setIsRefunding(false);
    }
  };

  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [selectedRefundId, setSelectedRefundId] = useState('');
  const [overrideReasonInput, setOverrideReasonInput] = useState('');
  const [isOverriding, setIsOverriding] = useState(false);

  const handleRetryRefund = async (refundId: string) => {
    try {
      await adminService.retryRefund(refundId);
      toast.success('Retry request submitted to gateway');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to retry refund');
    }
  };

  const handleSyncRefund = async (refundId: string) => {
    try {
      await adminService.syncRefund(refundId);
      toast.success('Synced status successfully');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to sync refund status');
    }
  };

  const handleOverrideRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsOverriding(true);
      await adminService.overrideRefund(selectedRefundId, overrideReasonInput);
      toast.success('Manual override marked successfully');
      setIsOverrideModalOpen(false);
      setOverrideReasonInput('');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to apply manual override');
    } finally {
      setIsOverriding(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'DELIVERED': return 'success';
      case 'CANCELLED': 
      case 'RETURNED': return 'error';
      case 'SHIPPED': return 'info';
      case 'PENDING':
      case 'PROCESSING': return 'warning';
      default: return 'default';
    }
  };

  // Build timeline events
  const timelineEvents = [
    { id: '1', title: 'Order Placed', date: new Date(order.createdAt).toLocaleString('en-IN'), isActive: true },
    { id: '2', title: 'Processing', date: order.orderStatus !== 'PENDING' ? 'Confirmed' : 'Pending', isActive: ['PROCESSING', 'HANDCRAFTING', 'SHIPPED', 'DELIVERED'].includes(order.orderStatus) },
    { id: '3', title: 'Handcrafted / Packed', date: ['HANDCRAFTING', 'SHIPPED', 'DELIVERED'].includes(order.orderStatus) ? 'Completed' : 'Pending', isActive: ['HANDCRAFTING', 'SHIPPED', 'DELIVERED'].includes(order.orderStatus) },
    { id: '4', title: 'Shipped', date: ['SHIPPED', 'DELIVERED'].includes(order.orderStatus) ? 'Dispatched' : 'Pending', isActive: ['SHIPPED', 'DELIVERED'].includes(order.orderStatus) },
    { id: '5', title: 'Delivered', date: order.orderStatus === 'DELIVERED' ? 'Delivered' : 'Pending', isActive: order.orderStatus === 'DELIVERED' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Printable Invoice Header styling */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-order, #printable-order * { visibility: visible; }
          #printable-order { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/orders" className="p-2 -ml-2 rounded-full hover:bg-surface-container text-on-secondary-container transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl font-bold text-primary-container">
                Order #{order.id.slice(-8).toUpperCase()}
              </h1>
              <AdminBadge variant={getStatusVariant(order.orderStatus)}>{order.orderStatus}</AdminBadge>
            </div>
            <p className="text-sm text-on-secondary-container mt-1">
              Placed on {new Date(order.createdAt).toLocaleString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handlePrintInvoice}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border border-outline-variant text-primary-container hover:bg-surface-container transition-colors"
          >
            <Printer className="h-4 w-4" />
            Print Invoice / Packing Slip
          </button>

          {order.paymentStatus === 'CAPTURED' && order.orderStatus !== 'REFUNDED' && (
            <button 
              onClick={() => {
                setRefundAmount(order.grandTotal.toString());
                setIsRefundModalOpen(true);
              }} 
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border border-[#c5221f] text-[#c5221f] hover:bg-[#fce8e6] transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Refund Order
            </button>
          )}

          {/* Status Select Dropdown */}
          <div className="flex items-center gap-2 bg-white dark:bg-[#1a1411] border border-outline-variant rounded-md px-3 py-1.5 shadow-xs">
            <span className="text-xs font-mono text-on-secondary-container uppercase tracking-wider font-semibold">Status:</span>
            <select
              value={order.orderStatus}
              disabled={isUpdating}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-transparent text-sm font-semibold text-primary-container dark:text-white focus:outline-none cursor-pointer disabled:opacity-50"
            >
              <option value="PENDING" className="dark:bg-[#1a1411]">🟡 PENDING</option>
              <option value="PROCESSING" className="dark:bg-[#1a1411]">⚙️ PROCESSING</option>
              <option value="HANDCRAFTING" className="dark:bg-[#1a1411]">🎨 HANDCRAFTING / PACKING</option>
              <option value="SHIPPED" className="dark:bg-[#1a1411]">🚚 SHIPPED</option>
              <option value="DELIVERED" className="dark:bg-[#1a1411]">✅ DELIVERED</option>
              <option value="CANCELLED" className="dark:bg-[#1a1411]">❌ CANCELLED</option>
              <option value="RETURNED" className="dark:bg-[#1a1411]">↩️ RETURNED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Order View */}
      <div id="printable-order" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (Items, Timeline & Notes) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Progress Timeline */}
          <div className="rounded-xl border border-outline-variant bg-background p-6">
            <h2 className="font-serif text-lg font-medium text-primary-container mb-4">Fulfillment Timeline</h2>
            <AdminTimeline events={timelineEvents} />
          </div>

          {/* Items */}
          <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
            <div className="border-b border-outline-variant px-6 py-4 bg-surface-container/30 flex items-center gap-2">
              <Package className="h-5 w-5 text-on-secondary-container" />
              <h2 className="font-serif text-lg font-medium text-primary-container">Order Items</h2>
            </div>
            <div className="p-0">
              <table className="w-full text-sm">
                <thead className="border-b border-outline-variant bg-surface-container/10">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-on-secondary-container">Product</th>
                    <th className="px-6 py-3 text-right font-medium text-on-secondary-container">Price</th>
                    <th className="px-6 py-3 text-right font-medium text-on-secondary-container">Qty</th>
                    <th className="px-6 py-3 text-right font-medium text-on-secondary-container">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {order.items.map((item: any) => (
                    <tr key={item.id} className="hover:bg-surface-container/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-md bg-surface-container flex-shrink-0 overflow-hidden">
                            {item.productImage ? (
                                <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-on-secondary-container/50">
                                  <Package className="h-6 w-6" />
                                </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-primary-container">{item.productName}</p>
                            <p className="text-xs text-on-secondary-container">SKU: {item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-primary-container">₹{item.unitPrice}</td>
                      <td className="px-6 py-4 text-right text-primary-container">{item.quantity}</td>
                      <td className="px-6 py-4 text-right font-medium text-primary-container">₹{item.lineTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-outline-variant p-6 bg-surface-container/10">
                <div className="flex justify-between py-1 text-sm text-on-secondary-container">
                  <span>Subtotal</span>
                  <span className="text-primary-container">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between py-1 text-sm text-on-secondary-container">
                  <span>Shipping</span>
                  <span className="text-primary-container">₹{order.shippingAmount}</span>
                </div>
                <div className="flex justify-between py-1 text-sm text-on-secondary-container">
                  <span>Tax (GST)</span>
                  <span className="text-primary-container">₹{order.taxAmount}</span>
                </div>
                <div className="flex justify-between py-2 mt-2 border-t border-outline-variant text-base font-bold text-primary-container">
                  <span>Grand Total</span>
                  <span>₹{order.grandTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity / Notes */}
          <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
            <div className="border-b border-outline-variant px-6 py-4 bg-surface-container/30 flex items-center gap-2">
              <FileText className="h-5 w-5 text-on-secondary-container" />
              <h2 className="font-serif text-lg font-medium text-primary-container">Order Notes & Internal Log</h2>
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Add an internal note..."
                  className="flex-1 rounded-md border border-outline-variant px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container"
                />
                <button 
                  onClick={() => handleStatusChange(order.orderStatus)}
                  disabled={!note.trim() || isUpdating}
                  className="rounded-md bg-surface-container px-4 py-2 text-sm font-medium text-primary-container hover:bg-outline-variant transition-colors disabled:opacity-50"
                >
                  Add Note
                </button>
              </div>
              <div className="space-y-4">
                {order.notes ? (
                   <div className="bg-surface-container/30 p-4 rounded-lg text-sm whitespace-pre-wrap font-mono text-on-secondary-container">
                     {order.notes}
                   </div>
                ) : (
                  <p className="text-sm text-on-secondary-container italic">No notes on this order.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Customer, Payment, Shipping) */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
            <div className="border-b border-outline-variant px-6 py-4 bg-surface-container/30 flex items-center gap-2">
              <User className="h-5 w-5 text-on-secondary-container" />
              <h2 className="font-serif text-lg font-medium text-primary-container">Customer</h2>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div>
                <p className="font-medium text-primary-container">{order.user?.firstName} {order.user?.lastName}</p>
                <p className="text-on-secondary-container mt-1">
                  <a href={`mailto:${order.user?.email}`} className="text-[#785d4b] hover:underline">{order.user?.email}</a>
                </p>
                <p className="text-on-secondary-container mt-1">{order.user?.phone || 'No phone provided'}</p>
              </div>
              <div className="pt-4 border-t border-outline-variant">
                <Link to={`/admin/customers/${order.userId}`} className="text-primary-container font-medium hover:underline flex items-center gap-1">
                  View full profile
                </Link>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
            <div className="border-b border-outline-variant px-6 py-4 bg-surface-container/30 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-on-secondary-container" />
              <h2 className="font-serif text-lg font-medium text-primary-container">Payment</h2>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-on-secondary-container">Method</span>
                <span className="font-medium text-primary-container px-2 py-1 bg-surface-container rounded-md">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-secondary-container">Status</span>
                <span className="font-medium text-primary-container">
                  <AdminBadge variant={order.paymentStatus === 'CAPTURED' ? 'success' : order.paymentStatus === 'FAILED' ? 'error' : 'warning'}>
                    {order.paymentStatus}
                  </AdminBadge>
                </span>
              </div>
              {order.payment && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-on-secondary-container">Payment ID</span>
                    <span className="font-mono text-xs text-primary-container">{order.payment.razorpayPaymentId || order.payment.id}</span>
                  </div>
                  {order.payment.paidAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-on-secondary-container">Paid At</span>
                      <span className="text-primary-container">{new Date(order.payment.paidAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Refund Attempts */}
          {order.payment?.refunds && order.payment.refunds.length > 0 && (
            <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
              <div className="border-b border-outline-variant px-6 py-4 bg-surface-container/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-on-secondary-container" />
                  <h2 className="font-serif text-lg font-medium text-primary-container">Refund History</h2>
                </div>
              </div>
              <div className="p-6 space-y-4 text-sm divide-y divide-outline-variant">
                {order.payment.refunds.map((refund: any, rIdx: number) => (
                  <div key={refund.id} className={`${rIdx > 0 ? 'pt-4' : ''} space-y-2`}>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-primary-container">₹{refund.amount}</span>
                      <AdminBadge variant={refund.status === 'PROCESSED' ? 'success' : refund.status === 'FAILED' ? 'error' : 'warning'}>
                        {refund.status}
                      </AdminBadge>
                    </div>
                    {refund.providerRefundId && (
                      <div className="flex justify-between">
                        <span className="text-on-secondary-container text-xs">Reference ID</span>
                        <span className="font-mono text-xs text-primary-container">{refund.providerRefundId}</span>
                      </div>
                    )}
                    {refund.bankReferenceNumber && (
                      <div className="flex justify-between">
                        <span className="text-on-secondary-container text-xs">Bank RRN</span>
                        <span className="font-mono text-xs text-primary-container">{refund.bankReferenceNumber}</span>
                      </div>
                    )}
                    {refund.manualOverride && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded text-xs text-emerald-800 dark:text-emerald-300">
                        <p className="font-semibold">Offline Override Settle</p>
                        <p className="italic">"{refund.overrideReason}"</p>
                      </div>
                    )}
                    {refund.status === 'FAILED' && (
                      <div className="bg-red-500/10 border border-red-500/20 p-2 rounded text-xs text-red-800 dark:text-red-300">
                        <p className="font-semibold">Gateway Error:</p>
                        <p>{refund.gatewayErrorDesc || refund.failureReason || 'Failed to process'}</p>
                      </div>
                    )}
                    {/* Action buttons */}
                    <div className="flex gap-2 pt-1">
                      {refund.status === 'FAILED' && (
                        <button
                          onClick={() => handleRetryRefund(refund.id)}
                          className="flex-1 bg-surface-container hover:bg-outline-variant text-primary-container text-xs font-semibold py-1 rounded border border-outline-variant transition-colors"
                        >
                          Retry
                        </button>
                      )}
                      {(refund.status === 'INITIATED' || refund.status === 'PROCESSING') && (
                        <button
                          onClick={() => handleSyncRefund(refund.id)}
                          className="flex-1 bg-surface-container hover:bg-outline-variant text-primary-container text-xs font-semibold py-1 rounded border border-outline-variant transition-colors"
                        >
                          Sync Gateway
                        </button>
                      )}
                      {refund.status !== 'PROCESSED' && (
                        <button
                          onClick={() => {
                            setSelectedRefundId(refund.id);
                            setIsOverrideModalOpen(true);
                          }}
                          className="flex-1 bg-surface-container hover:bg-outline-variant text-primary-container text-xs font-semibold py-1 rounded border border-outline-variant transition-colors"
                        >
                          Manual Override
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Info */}
          <div className="rounded-xl border border-outline-variant bg-background overflow-hidden">
            <div className="border-b border-outline-variant px-6 py-4 bg-surface-container/30 flex items-center gap-2">
              <Truck className="h-5 w-5 text-on-secondary-container" />
              <h2 className="font-serif text-lg font-medium text-primary-container">Shipping Address</h2>
            </div>
            <div className="p-6 text-sm text-primary-container space-y-1">
              <p className="font-medium">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
              <p>{order.shippingAddress?.country}</p>
              {order.shippingAddress?.phone && <p className="pt-2 text-on-secondary-container">Phone: {order.shippingAddress.phone}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      {isRefundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-background border border-outline-variant shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4 bg-surface-container/20">
              <h3 className="font-serif text-lg font-bold text-primary-container">Process Refund</h3>
              <button onClick={() => setIsRefundModalOpen(false)} className="text-on-secondary-container hover:text-primary-container">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleProcessRefund} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] mb-1.5">Refund Amount (₹)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={refundAmount} 
                  onChange={e => setRefundAmount(e.target.value)}
                  className="w-full rounded-md border border-[#c8b5aa] bg-transparent px-3.5 py-2 text-sm text-[#1f1610] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] mb-1.5">Reason / Note</label>
                <textarea 
                  value={refundReason} 
                  onChange={e => setRefundReason(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-[#c8b5aa] bg-transparent px-3.5 py-2 text-sm text-[#1f1610] outline-none"
                  placeholder="Reason for refunding this order..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                <button 
                  type="button" 
                  onClick={() => setIsRefundModalOpen(false)}
                  className="px-4 py-2 rounded-md border border-outline-variant text-sm font-medium text-primary-container hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isRefunding}
                  className="px-4 py-2 rounded-md bg-[#c5221f] text-sm font-medium text-white hover:bg-[#a51c1a] transition-colors disabled:opacity-50"
                >
                  {isRefunding ? 'Processing...' : 'Confirm Refund'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Override Modal */}
      {isOverrideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-background border border-outline-variant shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4 bg-surface-container/20">
              <h3 className="font-serif text-lg font-bold text-primary-container">Manual Offline Override</h3>
              <button onClick={() => setIsOverrideModalOpen(false)} className="text-on-secondary-container hover:text-primary-container">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleOverrideRefund} className="p-6 space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded text-xs text-amber-800 dark:text-amber-300">
                <p className="font-semibold">⚠️ WARNING:</p>
                <p>This will force mark the refund as completed offline. Only use this if the funds have been manually settled through offline channels (bank transfer/cash) and cannot be automated through the gateway.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4e3c30] mb-1.5">Override Reason / Audit Note</label>
                <textarea 
                  value={overrideReasonInput} 
                  onChange={e => setOverrideReasonInput(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-[#c8b5aa] bg-transparent px-3.5 py-2 text-sm text-[#1f1610] outline-none"
                  placeholder="Explain why offline override is being applied..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                <button 
                  type="button" 
                  onClick={() => setIsOverrideModalOpen(false)}
                  className="px-4 py-2 rounded-md border border-outline-variant text-sm font-medium text-primary-container hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isOverriding || !overrideReasonInput.trim()}
                  className="px-4 py-2 rounded-md bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {isOverriding ? 'Applying...' : 'Apply Offline Override'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
