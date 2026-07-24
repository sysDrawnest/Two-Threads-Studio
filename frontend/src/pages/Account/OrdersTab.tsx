import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, XCircle, Download, AlertTriangle } from 'lucide-react';
import { orderService, Order } from '../../services/orderService';
import LoadingSkeleton from './LoadingSkeleton';

export const OrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Fetch orders (no pagination UI in museum archive, just load recent)
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await orderService.getOrders(1, 10);
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
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
        fetchOrders();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setActionLoading(false);
    }
  };

  const isCancellable = (order: Order) => {
    return ['PENDING', 'AWAITING_PAYMENT', 'CONFIRMED'].includes(order.orderStatus);
  };

  if (loading && orders.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-16">
      
      {/* Detail View */}
      {selectedOrder ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="space-y-16"
        >
          <div className="flex justify-between items-center border-b border-neutral-200/50 pb-6">
            <button
              onClick={() => setSelectedOrder(null)}
              className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.2em] text-neutral-400 hover:text-[#1C1C1B] transition-colors"
            >
              <ChevronLeft className="w-3 h-3" />
              Return to Collection
            </button>
            <span className="font-serif italic text-neutral-400 text-lg">{selectedOrder.orderNumber}</span>
          </div>

          <div className="space-y-12">
            <div className="text-center space-y-4">
              <span className="font-sans text-[10px] uppercase tracking-widest text-neutral-400">
                Status
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-[#1C1C1B] tracking-wide">
                {selectedOrder.orderStatus}
              </h2>
              <p className="font-sans text-xs text-neutral-500 uppercase tracking-widest">
                {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                  month: 'long', year: 'numeric'
                })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
              <div className="space-y-8">
                <h3 className="font-sans text-[10px] uppercase tracking-widest text-neutral-400 border-b border-neutral-200/50 pb-4">
                  The Commission
                </h3>
                <div className="space-y-6">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex gap-6">
                      <div className="w-24 h-32 bg-neutral-100 flex-shrink-0">
                        {item.productImage && (
                          <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover grayscale opacity-80" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-serif text-xl text-[#1C1C1B]">{item.productName}</h4>
                        {item.variantName && <p className="font-sans text-xs text-neutral-500">{item.variantName}</p>}
                        {item.engravingText && (
                          <p className="font-serif italic text-sm text-[#A34A38] pt-2">"{item.engravingText}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="font-sans text-[10px] uppercase tracking-widest text-neutral-400 border-b border-neutral-200/50 pb-4">
                  Details
                </h3>
                <div className="space-y-6 font-sans text-sm text-neutral-600 leading-relaxed">
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Shipping To</span>
                    {selectedOrder.shippingAddress?.fullName}<br/>
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Total</span>
                    Rs. {Number(selectedOrder.grandTotal).toFixed(2)}
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-8">
                  <button
                    onClick={() => handleDownloadInvoice(selectedOrder)}
                    disabled={actionLoading}
                    className="text-left font-sans text-[10px] uppercase tracking-widest text-[#1C1C1B] hover:text-[#A34A38] transition-colors"
                  >
                    {actionLoading ? 'Archiving...' : 'Download Record →'}
                  </button>
                  {isCancellable(selectedOrder) && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="text-left font-sans text-[10px] uppercase tracking-widest text-rose-800 hover:text-rose-600 transition-colors"
                    >
                      Cancel Commission
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-16">
          <div className="text-center">
            <span className="font-sans text-[10px] uppercase tracking-widest text-neutral-400 block mb-2">
              Your Story
            </span>
            <h3 className="font-serif text-3xl font-light text-[#1C1C1B]">
              My Collection
            </h3>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-serif text-xl italic text-neutral-400">Your collection is empty.</p>
            </div>
          ) : (
            <div className="space-y-0">
              {orders.map((order, idx) => (
                <div
                  key={order.id}
                  className="group py-10 flex flex-col md:flex-row justify-between md:items-center gap-6 border-b border-neutral-200/50 hover:bg-white/50 transition-colors cursor-pointer px-4 -mx-4"
                  onClick={() => handleSelectOrder(order.id)}
                >
                  <div className="space-y-2">
                    <h4 className="font-serif text-2xl text-[#1C1C1B] group-hover:text-[#A34A38] transition-colors">
                      {order.items[0]?.productName || 'Handcrafted Item'} {order.items.length > 1 && `+ ${order.items.length - 1} more`}
                    </h4>
                    <p className="font-sans text-[10px] uppercase tracking-widest text-neutral-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex md:items-center gap-12">
                    <span className="font-serif italic text-neutral-500 text-lg">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cancel Order Modal overlay */}
      <AnimatePresence>
        {showCancelModal && selectedOrder && (
          <div className="fixed inset-0 bg-[#FAF9F7]/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-md w-full p-12 shadow-2xl space-y-8 text-center"
            >
              <h3 className="text-2xl font-light text-[#1C1C1B] font-serif">Cancel Commission?</h3>
              <p className="text-sm text-neutral-500 font-sans leading-relaxed">
                Are you sure you want to cancel this order? Once cancelled, the artisan will release the materials.
              </p>

              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason (optional)"
                className="w-full text-sm font-sans border-b border-neutral-200 p-2 focus:outline-none focus:border-[#1C1C1B] bg-transparent resize-none"
              />

              <div className="flex flex-col gap-4 pt-4">
                <button
                  onClick={handleCancelOrder}
                  disabled={actionLoading}
                  className="px-4 py-3 bg-[#1C1C1B] text-white text-[10px] uppercase tracking-widest font-sans transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-3 text-[#1C1C1B] text-[10px] uppercase tracking-widest font-sans transition-colors"
                >
                  Keep Order
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
