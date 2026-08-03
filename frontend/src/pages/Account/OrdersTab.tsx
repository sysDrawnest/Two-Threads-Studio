import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Info,
  Upload,
  X as XIcon,
  CheckCircle
} from 'lucide-react';
import { orderService, Order, Shipment } from '../../services/orderService';
import { reviewService } from '../../services/reviewService';
import { ReviewModal } from '../../components/reviews/ReviewModal';
import LoadingSkeleton from './LoadingSkeleton';
import { DynamicReturnStepper } from '../../components/account/DynamicReturnStepper';
import { RefundReceiptCard } from '../../components/account/RefundReceiptCard';
import { ReturnTrackingCard } from '../../components/account/ReturnTrackingCard';
import { ReturnActivityFeed } from '../../components/account/ReturnActivityFeed';

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
  { value: 'DAMAGED', label: 'Item arrived damaged' },
  { value: 'WRONG_PRODUCT', label: 'Wrong item received' },
  { value: 'DEFECTIVE', label: 'Item is defective' },
  { value: 'NOT_AS_DESCRIBED', label: 'Does not match description' },
  { value: 'SIZE_ISSUE', label: 'Size issue' },
  { value: 'COLOR_DIFFERENCE', label: 'Color difference' },
  { value: 'QUALITY_ISSUE', label: 'Quality not as expected' },
  { value: 'MISSING_PARTS', label: 'Missing parts or accessories' },
  { value: 'CHANGED_MIND', label: 'Changed my mind' },
  { value: 'OTHER', label: 'Other' },
] as const;

export const OrdersTab: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const orderIdFromUrl = searchParams.get('orderId');

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
  const [returnItems, setReturnItems] = useState<Array<{orderItemId: string; quantity: number; reason?: string}>>([]);
  const [returnMediaUrls, setReturnMediaUrls] = useState<string[]>([]);
  const [returnRefundType, setReturnRefundType] = useState('ORIGINAL_PAYMENT');
  const [returnNotes, setReturnNotes] = useState('');
  const [returnUploadLoading, setReturnUploadLoading] = useState(false);

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

  const handleSelectOrder = async (orderId: string, updateUrl = true) => {
    try {
      setLoading(true);
      setShipment(null);
      setShowTrackingPanel(false);
      if (updateUrl) {
        setSearchParams({ tab: 'orders', orderId });
      }
      const res = await orderService.getOrderById(orderId);
      if (res.success) {
        setSelectedOrder(res.order);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve order details');
      if (updateUrl) {
        setSearchParams({ tab: 'orders' });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderIdFromUrl) {
      handleSelectOrder(orderIdFromUrl, false);
    } else {
      setSelectedOrder(null);
    }
  }, [orderIdFromUrl]);

  const handleBackToHistory = () => {
    setSelectedOrder(null);
    setShowTrackingPanel(false);
    setShipment(null);
    setSearchParams({ tab: 'orders' });
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
    if (!returnReason) {
      alert('Please select a return reason.');
      return;
    }
    if (returnItems.length === 0) {
      alert('Please select at least one item to return.');
      return;
    }
    try {
      setActionLoading(true);
      const res = await orderService.requestReturn(selectedOrder.id, {
        reason: returnReason,
        notes: returnNotes || undefined,
        mediaUrls: returnMediaUrls,
        refundType: returnRefundType,
        items: returnItems,
      });
      if (res.success) {
        setShowReturnModal(false);
        setReturnReason('');
        setReturnItems([]);
        setReturnMediaUrls([]);
        setReturnNotes('');
        fetchOrders(page);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to submit return request');
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
              onClick={handleBackToHistory}
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

          {/* Return Request & Tracking Journey Section */}
          {((selectedOrder as any).returnRequests && (selectedOrder as any).returnRequests.length > 0) ? (
            (() => {
              const activeReturn = (selectedOrder as any).returnRequests[0];
              const isDigital = selectedOrder.items?.every((item: any) => item.product?.type === 'DIGITAL') ?? false;

              return (
                <div className="space-y-4">
                  {/* Dynamic Multi-Stage Visual Stepper */}
                  <DynamicReturnStepper returnRequest={activeReturn} isDigital={isDigital} />

                  {/* Return Shipment Tracking Card */}
                  <ReturnTrackingCard
                    courierPartner={activeReturn.courierPartner}
                    trackingNumber={activeReturn.trackingNumber}
                    trackingUrl={activeReturn.trackingUrl}
                    pickupScheduledAt={activeReturn.pickupScheduledAt}
                    estimatedDelivery={activeReturn.estimatedDelivery}
                    pickupStatus={activeReturn.pickupStatus}
                  />

                  {/* Refund Receipt Card (if refunded or refund processing) */}
                  {(activeReturn.status === 'REFUNDED' || activeReturn.status === 'REFUND_PROCESSING' || activeReturn.finalRefundAmount) && (
                    <RefundReceiptCard
                      refundAmount={Number(activeReturn.finalRefundAmount || activeReturn.approvedAmount || selectedOrder.grandTotal)}
                      refundId={(activeReturn as any).razorpayRefundId || activeReturn.refundId}
                      paymentMethod={selectedOrder.paymentMethod}
                      refundProcessedAt={activeReturn.refundProcessedAt || activeReturn.resolvedAt}
                      status={activeReturn.status}
                      bankReferenceNumber={(activeReturn as any).bankReferenceNumber}
                    />
                  )}

                  {/* Chronological Activity Feed */}
                  <ReturnActivityFeed timeline={activeReturn.timeline} />
                </div>
              );
            })()
          ) : (selectedOrder.orderStatus === 'RETURN_REQUESTED' || selectedOrder.orderStatus === 'RETURNED') ? (
            <div className="bg-[#faf8f5] border border-[#e8d7c8] rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <RotateCcw className="w-5 h-5 text-[#8b6f5c]" />
                <h4 className="font-serif font-semibold text-base text-[#5c4a3e]">
                  {selectedOrder.orderStatus === 'RETURN_REQUESTED' ? 'Return Request Submitted' : 'Return Processed'}
                </h4>
              </div>
              <p className="text-xs text-[#78675c] leading-relaxed">
                {selectedOrder.orderStatus === 'RETURN_REQUESTED'
                  ? 'We have received your return request and our studio team is reviewing it. Your item will be inspected upon warehouse receipt before a refund is issued.'
                  : 'Your return has been completed and processed.'}
              </p>
            </div>
          ) : null}

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
          <details className="group bg-white p-6 rounded-xl border border-neutral-100 space-y-6" open>
            <summary className="text-md font-bold text-neutral-900 cursor-pointer list-none flex items-center justify-between select-none">
              Order Progress Timeline
              <ChevronRight className="w-5 h-5 text-neutral-400 transition-transform group-open:rotate-90" />
            </summary>

            <div className="mt-6">
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
                <details className="group/log mt-6">
                  <summary className="cursor-pointer text-xs text-neutral-400 hover:text-neutral-700 transition-colors list-none flex items-center gap-1 select-none">
                    <ChevronRight className="w-3 h-3 transition-transform group-open/log:rotate-90" />
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
          </details>

          {/* Items & Addresses Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items (Left 2/3) */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-100 p-6 space-y-4">
              <h3 className="text-md font-bold text-neutral-900">Items Snapshot</h3>
              <div className="divide-y divide-neutral-100">
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="flex gap-4 flex-1">
                      <img
                        src={item.productImage || 'https://images.unsplash.com/photo-1584446927514-633215c0e0b3?w=100&auto=format&fit=crop'}
                        alt={item.productName}
                        className="w-20 h-20 sm:w-16 sm:h-16 rounded-md object-cover bg-neutral-150 border border-neutral-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-neutral-800 sm:truncate pr-4">{item.productName}</h4>
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
                    </div>
                    <div className="flex sm:flex-col justify-between items-center sm:items-end sm:text-right flex-shrink-0 gap-2 sm:gap-1 mt-2 sm:mt-0">
                      <div>
                        <p className="text-sm font-bold text-neutral-800">Rs. {Number(item.lineTotal).toFixed(2)}</p>
                        <p className="text-xs text-neutral-400">{item.quantity} x Rs. {Number(item.unitPrice).toFixed(2)}</p>
                      </div>
                      
                      {selectedOrder.orderStatus === 'DELIVERED' && (
                        <div>
                          <button
                            onClick={() => {
                              setActiveReviewProduct({
                                id: item.productId,
                                name: item.productName,
                                image: item.productImage || undefined
                              });
                              setShowReviewModal(true);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold px-4 py-2 sm:px-2.5 sm:py-1 rounded bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-sm"
                          >
                            {userReviews.some(r => r.productId === item.productId) ? 'Edit Review' : 'Write a Review'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Addresses & Bill Summary (Right 1/3) */}
            <div className="space-y-6">
              {/* Addresses - Now arranged side-by-side on desktop, stacked on mobile */}
              <div className="bg-white rounded-xl border border-neutral-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div>
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
      {showReturnModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Request a Return</h3>
                <p className="text-sm text-gray-500 mt-0.5">Order #{selectedOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => { setShowReturnModal(false); setReturnItems([]); setReturnReason(''); setReturnNotes(''); setReturnMediaUrls([]); }}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Step 1: Select Items */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">1. Select items to return</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item: any) => {
                    const selected = returnItems.find(r => r.orderItemId === item.id);
                    return (
                      <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        selected ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-amber-500"
                          checked={!!selected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setReturnItems(prev => [...prev, { orderItemId: item.id, quantity: 1 }]);
                            } else {
                              setReturnItems(prev => prev.filter(r => r.orderItemId !== item.id));
                            }
                          }}
                        />
                        <img src={item.productImage} alt={item.productName} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                          <p className="text-xs text-gray-500">Qty ordered: {item.quantity}</p>
                        </div>
                        {selected && item.quantity > 1 && (
                          <div className="flex items-center gap-1">
                            <button onClick={() => setReturnItems(prev => prev.map(r => r.orderItemId === item.id ? { ...r, quantity: Math.max(1, r.quantity - 1) } : r))} className="w-6 h-6 rounded border text-xs">-</button>
                            <span className="text-sm w-6 text-center">{selected.quantity}</span>
                            <button onClick={() => setReturnItems(prev => prev.map(r => r.orderItemId === item.id ? { ...r, quantity: Math.min(item.quantity, r.quantity + 1) } : r))} className="w-6 h-6 rounded border text-xs">+</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Reason */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">2. Reason for return</h4>
                <select
                  value={returnReason}
                  onChange={e => setReturnReason(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">Select a reason...</option>
                  {RETURN_REASONS.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Additional details (optional)"
                  value={returnNotes}
                  onChange={e => setReturnNotes(e.target.value)}
                  rows={2}
                  className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                />
              </div>

              {/* Step 3: Evidence upload & Unboxing Video */}
              {['DAMAGED', 'DEFECTIVE', 'WRONG_PRODUCT', 'QUALITY_ISSUE', 'MISSING_PARTS'].includes(returnReason) && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">3. Evidence & Unboxing Video <span className="text-[#A34A38] font-bold">*</span></h4>
                  
                  {/* Unboxing Video Requirement Callout */}
                  <div className="bg-[#FAF6F0] border-l-2 border-[#A34A38] p-3 mb-3 text-xs text-[#5a4a3f] rounded-r-md">
                    <p className="font-semibold text-[#1C1C1B] mb-1">Mandatory Unboxing Video Requirement:</p>
                    <p className="leading-relaxed">
                      For damage or wrong product claims, please provide a link to a continuous, unedited unboxing video (showing sealed parcel, shipping label, and full unpacking shot).
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 mb-2">Add photo or video URLs (Google Drive, Loom, Dropbox, Imgur, etc.):</p>
                  <div className="space-y-2">
                    {returnMediaUrls.map((url, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input 
                          value={url} 
                          onChange={e => setReturnMediaUrls(prev => prev.map((u, i) => i === idx ? e.target.value : u))} 
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#A34A38] focus:outline-none" 
                          placeholder={idx === 0 ? "Unboxing video URL (e.g., Drive / Loom)" : "Photo URL showing issue..."} 
                        />
                        <button onClick={() => setReturnMediaUrls(prev => prev.filter((_, i) => i !== idx))} className="text-red-400 p-1"><XIcon className="w-4 h-4" /></button>
                      </div>
                    ))}
                    {returnMediaUrls.length < 5 && (
                      <button onClick={() => setReturnMediaUrls(prev => [...prev, ''])} className="text-xs text-[#A34A38] font-medium underline cursor-pointer">+ Add photo/video URL</button>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Refund type */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">{['DAMAGED', 'DEFECTIVE', 'WRONG_PRODUCT', 'QUALITY_ISSUE', 'MISSING_PARTS'].includes(returnReason) ? '4.' : '3.'} Refund preference</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[{ value: 'ORIGINAL_PAYMENT', label: 'Original payment' }, { value: 'STORE_CREDIT', label: 'Store credit' }].map(rt => (
                    <button
                      key={rt.value}
                      onClick={() => setReturnRefundType(rt.value)}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                        returnRefundType === rt.value
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {rt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 leading-relaxed">
                Returns are carefully reviewed within 24–48 business hours. Approved returns undergo physical studio inspection before refunds or replacements are issued.
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => { setShowReturnModal(false); setReturnItems([]); setReturnReason(''); }}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestReturn}
                disabled={actionLoading || returnItems.length === 0 || !returnReason}
                className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Submitting...' : 'Submit Return Request'}
              </button>
            </div>
          </div>
        </div>
      )}

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
