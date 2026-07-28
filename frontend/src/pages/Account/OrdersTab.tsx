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
  AlertCircle,
  RotateCcw,
  MapPin,
  ExternalLink,
  Info
} from 'lucide-react';
import { orderService, Order, Shipment } from '../../services/orderService';
import { reviewService } from '../../services/reviewService';
import { ReviewModal } from '../../components/reviews/ReviewModal';
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

const RETURN_REASONS = [
  'Item arrived damaged',
  'Item does not match description',
  'Wrong item received',
  'Quality not as expected',
  'Changed my mind',
  'Other',
];

export const OrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cancel modal
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Return modal
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [returnReasonOther, setReturnReasonOther] = useState('');

  // Shipment tracking panel
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [shipmentLoading, setShipmentLoading] = useState(false);
  const [showTrackingPanel, setShowTrackingPanel] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Reviews state
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeReviewProduct, setActiveReviewProduct] = useState<{ id: string; name: string; image?: string } | null>(null);

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

  const fetchUserReviews = async () => {
    try {
      const res = await reviewService.getMyReviews();
      if (res.success && Array.isArray(res.data)) {
        setUserReviews(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch user reviews', err);
    }
  };

  useEffect(() => {
    fetchOrders(1);
    fetchUserReviews();
  }, []);

  const handleSelectOrder = async (orderId: string) => {
    try {
      setLoading(true);
      setShipment(null);
      setShowTrackingPanel(false);
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
        fetchOrders(page);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestReturn = async () => {
    if (!selectedOrder) return;
    const finalReason = returnReason === 'Other' ? returnReasonOther : returnReason;
    if (!finalReason.trim()) {
      alert('Please provide a reason for the return.');
      return;
    }
    try {
      setActionLoading(true);
      const res = await orderService.requestReturn(selectedOrder.id, finalReason);
      if (res.success) {
        setSelectedOrder(res.order);
        setShowReturnModal(false);
        setReturnReason('');
        setReturnReasonOther('');
        fetchOrders(page);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit return request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFetchTracking = async () => {
    if (!selectedOrder) return;
    try {
      setShipmentLoading(true);
      setShowTrackingPanel(true);
      const res = await orderService.getShipmentTracking(selectedOrder.id);
      setShipment(res.shipment);
    } catch (err: any) {
      setShipment(null);
    } finally {
      setShipmentLoading(false);
    }
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'RETURN_REQUESTED':
      case 'RETURNED':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'PROCESSING':
      case 'HANDCRAFTING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
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
      case 'OUT_FOR_DELIVERY':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'RETURN_REQUESTED':
      case 'RETURNED':
        return <RotateCcw className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  const isCancellable = (order: Order) =>
    ['PENDING', 'AWAITING_PAYMENT', 'CONFIRMED'].includes(order.orderStatus);

  const isShippedOrBeyond = (order: Order) =>
    ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.orderStatus);

  const isReturnable = (order: Order) =>
    order.orderStatus === 'DELIVERED';

  // Get index of status in steps
  const getStatusIndex = (currentStatus: string) =>
    ORDER_STATUS_STEPS.findIndex(step => step.status === currentStatus);

  const formatShipmentStatus = (status: string) =>
    status.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase());

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
              onClick={() => { setSelectedOrder(null); setShowTrackingPanel(false); setShipment(null); }}
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
              {isShippedOrBeyond(selectedOrder) && (
                <button
                  onClick={handleFetchTracking}
                  disabled={shipmentLoading}
                  className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-700 hover:bg-blue-50 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                >
                  <Truck className="w-4 h-4" />
                  {shipmentLoading ? 'Loading...' : 'Track Shipment'}
                </button>
              )}
              {isReturnable(selectedOrder) && (
                <button
                  onClick={() => setShowReturnModal(true)}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 border border-orange-200 text-orange-700 hover:bg-orange-50 text-sm font-medium rounded-md transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Request Return
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

          {/* Shipment Tracking Panel */}
          <AnimatePresence>
            {showTrackingPanel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <h3 className="text-sm font-bold text-blue-900">Shipment Tracking</h3>
                    </div>
                    <button
                      onClick={() => setShowTrackingPanel(false)}
                      className="text-blue-400 hover:text-blue-700 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>

                  {shipmentLoading ? (
                    <div className="flex items-center gap-3 text-blue-600 text-sm">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      Fetching shipment details...
                    </div>
                  ) : shipment ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">Tracking Number</p>
                        <p className="text-sm font-bold text-neutral-900 font-mono">{shipment.trackingNumber || 'Not assigned yet'}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">Carrier</p>
                        <p className="text-sm font-bold text-neutral-900">{shipment.carrier || 'N/A'}</p>
                        {shipment.shippingMethod && (
                          <p className="text-xs text-neutral-500 mt-0.5">{shipment.shippingMethod}</p>
                        )}
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">Status</p>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                          shipment.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                          shipment.status === 'SHIPPED' || shipment.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {formatShipmentStatus(shipment.status)}
                        </span>
                      </div>
                      {shipment.estimatedDelivery && (
                        <div className="bg-white rounded-lg p-4 border border-blue-100">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">Est. Delivery</p>
                          <p className="text-sm font-medium text-neutral-800">
                            {new Date(shipment.estimatedDelivery).toLocaleDateString('en-IN', {
                              weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                      {shipment.shippedAt && (
                        <div className="bg-white rounded-lg p-4 border border-blue-100">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">Shipped On</p>
                          <p className="text-sm font-medium text-neutral-800">
                            {new Date(shipment.shippedAt).toLocaleDateString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                      {shipment.deliveredAt && (
                        <div className="bg-white rounded-lg p-4 border border-blue-100">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">Delivered On</p>
                          <p className="text-sm font-medium text-emerald-700 font-bold">
                            {new Date(shipment.deliveredAt).toLocaleDateString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-blue-600 text-sm">
                      <Info className="w-4 h-4 flex-shrink-0" />
                      <p>No shipment details are available for this order yet. Check back once it has been dispatched.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Return Request Banner (when already requested) */}
          {(selectedOrder.orderStatus === 'RETURN_REQUESTED' || selectedOrder.orderStatus === 'RETURNED') && (
            <div className="flex items-start gap-3 bg-orange-50 border border-orange-100 p-4 rounded-xl text-orange-800">
              <RotateCcw className="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-600" />
              <div>
                <h4 className="font-bold text-sm">
                  {selectedOrder.orderStatus === 'RETURN_REQUESTED' ? 'Return Request Submitted' : 'Return Processed'}
                </h4>
                <p className="text-xs mt-1 text-orange-700">
                  {selectedOrder.orderStatus === 'RETURN_REQUESTED'
                    ? 'Our team is reviewing your return request. You will hear from us within 2–3 business days.'
                    : 'Your return has been processed. Refund will be initiated within 5–7 business days.'}
                </p>
              </div>
            </div>
          )}

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
                  {selectedOrder.orderStatus.replace(/_/g, ' ')}
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

            {/* Status History Log */}
            {selectedOrder.statusHistory.length > 0 && (
              <details className="group mt-2">
                <summary className="cursor-pointer text-xs text-neutral-400 hover:text-neutral-700 transition-colors list-none flex items-center gap-1 select-none">
                  <ChevronRight className="w-3 h-3 transition-transform group-open:rotate-90" />
                  View full status history ({selectedOrder.statusHistory.length} events)
                </summary>
                <div className="mt-3 space-y-2 pl-4 border-l-2 border-neutral-100">
                  {[...selectedOrder.statusHistory].reverse().map(hist => (
                    <div key={hist.id} className="flex gap-3 text-xs text-neutral-600">
                      <span className="text-neutral-400 whitespace-nowrap flex-shrink-0">
                        {new Date(hist.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                      <span>
                        <span className="font-semibold text-neutral-800">{hist.newStatus.replace(/_/g, ' ')}</span>
                        {hist.note && <span className="text-neutral-500"> — {hist.note}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </details>
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
                      {selectedOrder.orderStatus === 'DELIVERED' && (
                        <div className="mt-2">
                          <button
                            onClick={() => {
                              setActiveReviewProduct({
                                id: item.productId,
                                name: item.productName,
                                image: item.productImage || undefined
                              });
                              setShowReviewModal(true);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded bg-[#fff8e1] text-[#f57f17] border border-[#ffe082] hover:bg-[#fff3e0] transition-colors"
                          >
                            {userReviews.some(r => r.productId === item.productId) ? 'Edit Review' : 'Write a Review'}
                          </button>
                        </div>
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
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl font-light text-[#1C1C1B]">Your Collection</h2>
            <p className="font-sans text-sm text-[#5a4a3f] mt-4">A curated record of your handcrafted pieces.</p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-24">
              <h3 className="font-serif text-xl text-[#1C1C1B]">Your collection is empty</h3>
              <p className="font-sans text-sm text-[#5a4a3f] mt-4 max-w-sm mx-auto">
                You haven't commissioned any pieces yet. Visit our studio to begin your journey.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="group flex flex-col no-underline cursor-pointer"
                  onClick={() => handleSelectOrder(order.id)}
                >
                  <div className="aspect-[4/5] bg-[#FAF9F7] overflow-hidden mb-6">
                    <img
                      src={order.items[0]?.productImage || "https://images.unsplash.com/photo-1612423215286-9a2c3fbcc977?auto=format&fit=crop&q=80&w=800"}
                      alt={order.items[0]?.productName || 'Commission'}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#8c7a6b]">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h4 className="font-serif text-xl text-[#1C1C1B] group-hover:text-[#A34A38] transition-colors line-clamp-1">
                      {order.items[0]?.productName || 'Studio Commission'}
                    </h4>

                    <div className="flex justify-between items-center mt-2 pt-4 border-t border-[#e8e3dc]">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getStatusBadgeStyles(order.orderStatus)}`}>
                        {getStatusIcon(order.orderStatus)}
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                      <span className="font-sans text-xs text-[#1C1C1B]">
                        ₹{Number(order.grandTotal).toFixed(0)}
                      </span>
                    </div>

                    <div className="mt-4">
                      <span className="font-sans text-[10px] tracking-widest uppercase border-b border-transparent group-hover:border-[#A34A38] group-hover:text-[#A34A38] text-[#5a4a3f] transition-all pb-1">
                        View Details
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-8 mt-16 pt-8 border-t border-[#e8e3dc]">
              <button
                onClick={() => { if (page > 1) fetchOrders(page - 1); }}
                disabled={page === 1}
                className="font-sans text-xs uppercase tracking-widest hover:text-[#A34A38] disabled:opacity-30 transition-colors"
              >
                Previous
              </button>
              <span className="font-sans text-xs text-[#5a4a3f]">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => { if (page < totalPages) fetchOrders(page + 1); }}
                disabled={page === totalPages}
                className="font-sans text-xs uppercase tracking-widest hover:text-[#A34A38] disabled:opacity-30 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Cancel Order Modal */}
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
                    Are you sure you want to cancel this order? Once cancelled, stock will be released and this cannot be undone.
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

      {/* Return Request Modal */}
      <AnimatePresence>
        {showReturnModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl border border-neutral-100 max-w-md w-full p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-start gap-3 text-orange-600">
                <RotateCcw className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 font-serif">Request a Return</h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Please select a reason for returning this order. Our team will review and respond within 2–3 business days.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-600">Reason for return *</label>
                <div className="space-y-2">
                  {RETURN_REASONS.map(r => (
                    <label key={r} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="returnReason"
                        value={r}
                        checked={returnReason === r}
                        onChange={() => setReturnReason(r)}
                        className="accent-[#A34A38]"
                      />
                      <span className={`text-sm transition-colors ${returnReason === r ? 'text-[#A34A38] font-medium' : 'text-neutral-700 group-hover:text-neutral-900'}`}>
                        {r}
                      </span>
                    </label>
                  ))}
                </div>

                {returnReason === 'Other' && (
                  <textarea
                    value={returnReasonOther}
                    onChange={(e) => setReturnReasonOther(e.target.value)}
                    placeholder="Please describe your reason..."
                    className="w-full text-sm border border-neutral-200 rounded-lg p-3 focus:outline-none focus:border-neutral-400 min-h-[80px] mt-2"
                  />
                )}
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex gap-2 text-xs text-amber-800">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>Returns are eligible within 7 days of delivery. Items must be in original condition and packaging.</p>
              </div>

              <div className="flex justify-end gap-3 pt-1">
                <button
                  onClick={() => { setShowReturnModal(false); setReturnReason(''); setReturnReasonOther(''); }}
                  className="px-4 py-2 border border-neutral-200 text-neutral-600 hover:bg-neutral-50 rounded-md text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestReturn}
                  disabled={actionLoading || !returnReason}
                  className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-md text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Submitting...' : 'Submit Return Request'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {activeReviewProduct && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setActiveReviewProduct(null);
          }}
          productId={activeReviewProduct.id}
          productName={activeReviewProduct.name}
          productImage={activeReviewProduct.image}
          initialReview={userReviews.find(r => r.productId === activeReviewProduct.id)}
          onSubmitSuccess={() => {
            fetchUserReviews();
          }}
        />
      )}
    </div>
  );
};

export default OrdersTab;
