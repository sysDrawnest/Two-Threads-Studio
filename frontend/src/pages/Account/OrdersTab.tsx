import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Calendar,
  ChevronRight,
  ChevronLeft,
  XCircle,
  Clock,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Download,
  AlertCircle
} from 'lucide-react';
import { orderService, Order } from '../../services/orderService';
import LoadingSkeleton from './LoadingSkeleton';

const ORDER_STATUS_STEPS = [
  { status: 'PENDING', label: 'Order Placed', desc: 'Awaiting initial confirmation.' },
  { status: 'AWAITING_PAYMENT', label: 'Payment Pending', desc: 'Secure payment is being verified.' },
  { status: 'CONFIRMED', label: 'Confirmed', desc: 'Artisans have accepted the order.' },
  { status: 'PROCESSING', label: 'Preparing Materials', desc: 'Sourcing select woods, linens, and threads.' },
  { status: 'HANDCRAFTING', label: 'Handcrafting', desc: 'Artisans are building your customized piece.' },
  { status: 'SHIPPED', label: 'Shipped', desc: 'Your package is on its way to you.' },
  { status: 'DELIVERED', label: 'Delivered', desc: 'Enjoy your handcrafted goods!' }
];

export const OrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (targetPage = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res = await orderService.getOrders(targetPage, 5);
      if (res.success) {
        setOrders(res.orders);
        setPage(res.pagination.page);
        setTotalPages(res.pagination.totalPages);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const handleSelectOrder = async (orderId: string) => {
    try {
      setLoading(true);
      const res = await orderService.getOrderById(orderId);
      if (res.success) {
        setSelectedOrder(res.order);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve order details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (order: Order) => {
    try {
      setActionLoading(true);
      await orderService.downloadInvoice(order.id, order.orderNumber);
    } catch (err: any) {
      alert(err.message || 'Failed to download invoice PDF');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    try {
      setActionLoading(true);
      const res = await orderService.cancelOrder(selectedOrder.id, cancelReason || 'Cancelled by customer');
      if (res.success) {
        setSelectedOrder(res.order);
        setShowCancelModal(false);
        setCancelReason('');
        // Refresh orders list
        fetchOrders(page);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'PROCESSING':
      case 'HANDCRAFTING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'SHIPPED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'CANCELLED':
      case 'REFUNDED':
        return <XCircle className="w-4 h-4 text-rose-600" />;
      case 'SHIPPED':
        return <Truck className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  const isCancellable = (order: Order) => {
    return ['PENDING', 'AWAITING_PAYMENT', 'CONFIRMED'].includes(order.orderStatus);
  };

  // Get index of status in steps
  const getStatusIndex = (currentStatus: string) => {
    return ORDER_STATUS_STEPS.findIndex(step => step.status === currentStatus);
  };

  if (loading && orders.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Detail View */}
      {selectedOrder ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="space-y-6"
        >
          {/* Detail Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-6">
            <button
              onClick={() => setSelectedOrder(null)}
              className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors self-start"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Order History
            </button>
            <div className="flex flex-wrap gap-3">
              {isCancellable(selectedOrder) && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-medium rounded-md transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Order
                </button>
              )}
              <button
                onClick={() => handleDownloadInvoice(selectedOrder)}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {actionLoading ? 'Downloading...' : 'Download Invoice'}
              </button>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-neutral-50 p-6 rounded-xl border border-neutral-150">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-450">Order Detail</span>
              <p className="font-bold text-neutral-900 text-lg">{selectedOrder.orderNumber}</p>
              <p className="text-sm text-neutral-500">Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric'
              })}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-450">Financial Summary</span>
              <p className="font-bold text-neutral-900 text-lg">Rs. {Number(selectedOrder.grandTotal).toFixed(2)}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(selectedOrder.orderStatus)}`}>
                  {getStatusIcon(selectedOrder.orderStatus)}
                  {selectedOrder.orderStatus}
                </span>
                <span className="text-neutral-400">|</span>
                <span className="text-xs text-neutral-500 uppercase font-semibold">Payment: {selectedOrder.paymentStatus}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-450">Estimated Shipping</span>
              <p className="font-medium text-neutral-800 text-sm">
                {selectedOrder.estimatedCompletionDate 
                  ? new Date(selectedOrder.estimatedCompletionDate).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })
                  : 'Artisans calculating time...'
                }
              </p>
              <p className="text-xs text-neutral-500">Each piece is individually handcrafted and detailed.</p>
            </div>
          </div>

          {/* Timeline Visual Status Tracker */}
          <div className="bg-white p-6 rounded-xl border border-neutral-100 space-y-6">
            <h3 className="text-md font-bold text-neutral-900">Order Progress Timeline</h3>
            
            {['CANCELLED', 'REFUNDED'].includes(selectedOrder.orderStatus) ? (
              <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 p-4 rounded-lg text-rose-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Order Cancelled</h4>
                  <p className="text-xs mt-1">This order has been cancelled. If any payment was captured, refund processing has begun.</p>
                  {selectedOrder.statusHistory.length > 0 && (
                    <p className="text-xs italic mt-2 text-rose-600">
                      Reason: "{selectedOrder.statusHistory[selectedOrder.statusHistory.length - 1].note || 'N/A'}"
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative pl-6 sm:pl-0 sm:flex sm:justify-between items-start gap-4">
                {/* Visual Line for desktop */}
                <div className="hidden sm:block absolute left-0 right-0 top-4 h-0.5 bg-neutral-100 -z-10" />

                {ORDER_STATUS_STEPS.map((step, idx) => {
                  const currentIdx = getStatusIndex(selectedOrder.orderStatus);
                  const isCompleted = idx < currentIdx;
                  const isActive = idx === currentIdx;

                  return (
                    <div key={step.status} className="relative flex sm:flex-col items-start sm:items-center sm:text-center flex-1 pb-6 sm:pb-0 gap-4 sm:gap-2">
                      {/* Vertical line for mobile */}
                      {idx < ORDER_STATUS_STEPS.length - 1 && (
                        <div className="sm:hidden absolute left-[15px] top-[30px] bottom-0 w-0.5 bg-neutral-100" />
                      )}

                      {/* Timeline Dot */}
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 bg-white z-10 transition-all ${
                        isCompleted ? 'border-emerald-600 text-emerald-600' :
                        isActive ? 'border-amber-600 text-amber-600 ring-4 ring-amber-50' :
                        'border-neutral-200 text-neutral-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-bold">{idx + 1}</span>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <p className={`text-xs font-bold ${isActive ? 'text-amber-800' : isCompleted ? 'text-emerald-800' : 'text-neutral-600'}`}>
                          {step.label}
                        </p>
                        <p className="text-[10px] text-neutral-400 leading-tight max-w-[120px]">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Items & Addresses Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items (Left 2/3) */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-100 p-6 space-y-4">
              <h3 className="text-md font-bold text-neutral-900">Items Snapshot</h3>
              <div className="divide-y divide-neutral-100">
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <img
                      src={item.productImage || 'https://images.unsplash.com/photo-1584446927514-633215c0e0b3?w=100&auto=format&fit=crop'}
                      alt={item.productName}
                      className="w-16 h-16 rounded-md object-cover bg-neutral-150 border border-neutral-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-neutral-800 truncate">{item.productName}</h4>
                      {item.variantName && (
                        <p className="text-xs text-neutral-450 mt-0.5">{item.variantName}</p>
                      )}
                      {item.customization && Object.keys(item.customization).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {Object.entries(item.customization).map(([k, v]) => (
                            <span key={k} className="text-[9px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded font-medium">
                              {k}: {String(v)}
                            </span>
                          ))}
                        </div>
                      )}
                      {item.engravingText && (
                        <p className="text-[10px] text-amber-700 mt-1 font-semibold">
                          Engraved: "{item.engravingText}"
                        </p>
                      )}
                      {item.giftWrap && (
                        <span className="inline-flex text-[9px] bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded font-medium mt-1">
                          🎁 Gift Wrapped
                        </span>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0 space-y-1">
                      <p className="text-sm font-bold text-neutral-800">Rs. {Number(item.lineTotal).toFixed(2)}</p>
                      <p className="text-xs text-neutral-400">{item.quantity} x Rs. {Number(item.unitPrice).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Addresses & Bill Summary (Right 1/3) */}
            <div className="space-y-6">
              {/* Addresses */}
              <div className="bg-white rounded-xl border border-neutral-100 p-6 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wide">Shipping Address</h4>
                  <div className="text-sm text-neutral-700 mt-2 space-y-0.5">
                    <p className="font-bold text-neutral-800">{selectedOrder.shippingAddress?.fullName}</p>
                    <p>{selectedOrder.shippingAddress?.line1}</p>
                    {selectedOrder.shippingAddress?.line2 && <p>{selectedOrder.shippingAddress?.line2}</p>}
                    <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}</p>
                    <p className="text-xs text-neutral-500 mt-1">Phone: {selectedOrder.shippingAddress?.phone}</p>
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-4">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wide">Billing Address</h4>
                  <div className="text-sm text-neutral-700 mt-2 space-y-0.5">
                    <p className="font-bold text-neutral-800">{selectedOrder.billingAddress?.fullName}</p>
                    <p>{selectedOrder.billingAddress?.line1}</p>
                    {selectedOrder.billingAddress?.line2 && <p>{selectedOrder.billingAddress?.line2}</p>}
                    <p>{selectedOrder.billingAddress?.city}, {selectedOrder.billingAddress?.state} - {selectedOrder.billingAddress?.postalCode}</p>
                    <p className="text-xs text-neutral-500 mt-1">Phone: {selectedOrder.billingAddress?.phone}</p>
                  </div>
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="bg-white rounded-xl border border-neutral-100 p-6 space-y-3">
                <h4 className="text-sm font-bold text-neutral-800">Financial Breakup</h4>
                
                <div className="flex justify-between text-sm text-neutral-600 pt-2">
                  <span>Subtotal</span>
                  <span>Rs. {Number(selectedOrder.subtotal).toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Discount</span>
                  <span className="text-emerald-600">-Rs. {Number(selectedOrder.discount).toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Shipping</span>
                  <span>Rs. {Number(selectedOrder.shipping).toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Tax</span>
                  <span>Rs. {Number(selectedOrder.tax).toFixed(2)}</span>
                </div>

                <div className="border-t border-neutral-150 pt-3 flex justify-between font-bold text-neutral-900">
                  <span>Grand Total</span>
                  <span>Rs. {Number(selectedOrder.grandTotal).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">My Orders</h2>
            <span className="text-sm text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full font-medium">
              {orders.length} orders
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
              <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-neutral-800">No Orders Found</h3>
              <p className="text-sm text-neutral-500 max-w-sm mx-auto mt-2">
                You haven't placed any orders yet. Visit our shop and explore premium crafting kits.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="bg-white border border-neutral-150 hover:border-neutral-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-neutral-900">{order.orderNumber}</span>
                        <span className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusBadgeStyles(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </span>
                        <span>•</span>
                        <span>{order.items?.length || 0} Products</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-neutral-100">
                      <div className="text-left md:text-right">
                        <p className="text-[10px] text-neutral-400 uppercase tracking-wide font-semibold">Total Amount</p>
                        <p className="text-md font-bold text-neutral-900">Rs. {Number(order.grandTotal).toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => handleSelectOrder(order.id)}
                        className="flex items-center gap-1.5 px-4 py-2 border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-sm font-semibold rounded-lg transition-colors"
                      >
                        Manage
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 pt-4">
                  <button
                    onClick={() => {
                      if (page > 1) fetchOrders(page - 1);
                    }}
                    disabled={page === 1}
                    className="p-2 border border-neutral-250 rounded-lg hover:bg-neutral-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-medium text-neutral-700">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => {
                      if (page < totalPages) fetchOrders(page + 1);
                    }}
                    disabled={page === totalPages}
                    className="p-2 border border-neutral-250 rounded-lg hover:bg-neutral-50 disabled:opacity-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Cancel Order Modal overlay */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl border border-neutral-100 max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-start gap-3 text-rose-600">
                <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 font-serif">Cancel Handcrafted Order?</h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Are you sure you want to cancel this order? Oncecancelled, stock will be released and this cannot be undone.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600">Reason for cancellation (optional)</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Ordered a wrong variant, changed my mind"
                  className="w-full text-sm border border-neutral-200 rounded-lg p-3 focus:outline-none focus:border-neutral-400 min-h-[80px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-600 hover:bg-neutral-50 rounded-md text-sm font-semibold transition-colors"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 rounded-md text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersTab;
