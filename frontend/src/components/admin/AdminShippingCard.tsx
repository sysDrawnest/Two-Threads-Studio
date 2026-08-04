import React, { useState, useEffect } from 'react';
import { Truck, Package, Calendar, FileText, Download, XCircle, RotateCcw, ExternalLink, Activity, RefreshCw } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminBadge } from './ui';
import toast from 'react-hot-toast';

interface AdminShippingCardProps {
  orderId: string;
  orderStatus: string;
  onUpdate?: () => void;
}

export const AdminShippingCard: React.FC<AdminShippingCardProps> = ({ orderId, orderStatus, onUpdate }) => {
  const [shipment, setShipment] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [capabilities, setCapabilities] = useState<Record<string, boolean>>({});
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modals state
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [timelineRes, healthRes, capabilitiesRes] = await Promise.allSettled([
        adminService.getShipmentTimeline(orderId),
        adminService.getProviderHealth(),
        adminService.getShippingCapabilities(),
      ]);

      if (timelineRes.status === 'fulfilled') {
        const events = timelineRes.value?.data || timelineRes.value || [];
        setTimeline(events);
      }

      if (healthRes.status === 'fulfilled') {
        setHealth(healthRes.value?.data || healthRes.value);
      }

      if (capabilitiesRes.status === 'fulfilled') {
        setCapabilities(capabilitiesRes.value?.data || capabilitiesRes.value || {});
      }

      // Load shipment via order endpoint or timeline
      const orderRes = await adminService.getOrder(orderId);
      const orderData = orderRes?.order || orderRes?.data || orderRes;
      if (orderData?.shipment) {
        setShipment(orderData.shipment);
      }
    } catch (err: any) {
      console.error('Failed to load shipping details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [orderId]);

  const handleCreateShipment = async () => {
    try {
      setActionLoading('create');
      await adminService.createShipment(orderId);
      toast.success('Shipment created successfully');
      await loadData();
      if (onUpdate) onUpdate();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create shipment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSchedulePickup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading('pickup');
      await adminService.schedulePickup(orderId, pickupDate ? new Date(pickupDate).toISOString() : undefined);
      toast.success('Courier pickup scheduled');
      setIsPickupModalOpen(false);
      await loadData();
      if (onUpdate) onUpdate();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to schedule pickup');
    } finally {
      setActionLoading(null);
    }
  };

  const handleGenerateLabel = async () => {
    try {
      setActionLoading('label');
      const res = await adminService.generateLabel(orderId);
      const url = res?.data?.labelUrl || res?.labelUrl || shipment?.labelUrl;
      if (url) {
        window.open(url, '_blank');
        toast.success('Label opened in new tab');
      } else {
        toast.error('Label generated but no URL returned');
      }
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to generate label');
    } finally {
      setActionLoading(null);
    }
  };

  const handleGenerateInvoice = async () => {
    try {
      setActionLoading('invoice');
      const res = await adminService.generateInvoice(orderId);
      const url = res?.data?.invoiceUrl || res?.invoiceUrl || shipment?.invoiceUrl;
      if (url) {
        window.open(url, '_blank');
        toast.success('Invoice opened in new tab');
      } else {
        toast.error('Invoice generated but no URL returned');
      }
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to generate invoice');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading('cancel');
      await adminService.cancelShipment(orderId, cancelReason);
      toast.success('Shipment cancelled');
      setIsCancelModalOpen(false);
      await loadData();
      if (onUpdate) onUpdate();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel shipment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateReturn = async () => {
    try {
      setActionLoading('return');
      await adminService.createReturnShipment(orderId);
      toast.success('Return shipment created');
      await loadData();
      if (onUpdate) onUpdate();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create return shipment');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'success';
      case 'CANCELLED': case 'FAILED_DELIVERY': return 'error';
      case 'IN_TRANSIT': case 'OUT_FOR_DELIVERY': case 'SHIPPED': case 'PICKED_UP': return 'info';
      case 'PICKUP_SCHEDULED': case 'PACKING': case 'READY_TO_SHIP': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="rounded-xl border border-outline-variant bg-background overflow-hidden shadow-xs">
      {/* Card Header */}
      <div className="border-b border-outline-variant px-6 py-4 bg-surface-container/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary-container" />
          <h2 className="font-serif text-lg font-medium text-primary-container">Enterprise Shipping Management</h2>
        </div>
        {health && (
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className={`inline-block h-2 w-2 rounded-full ${health.authenticated ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="text-on-secondary-container">{health.provider || 'Provider'}:</span>
            <span className="font-semibold text-primary-container">{health.authenticated ? 'Connected' : 'Mock Mode'}</span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-6 text-on-secondary-container text-sm">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Loading shipping details...
          </div>
        ) : shipment ? (
          <>
            {/* Shipment Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-surface-container/20 border border-outline-variant text-sm">
              <div>
                <span className="text-xs text-on-secondary-container block uppercase font-mono tracking-wider">AWB Number</span>
                <span className="font-mono font-bold text-primary-container">{shipment.externalAwbNumber || shipment.trackingNumber || 'Pending AWB'}</span>
              </div>
              <div>
                <span className="text-xs text-on-secondary-container block uppercase font-mono tracking-wider">Courier Partner</span>
                <span className="font-medium text-primary-container">{shipment.courierName || shipment.carrier || 'Unassigned'}</span>
              </div>
              <div>
                <span className="text-xs text-on-secondary-container block uppercase font-mono tracking-wider">Status</span>
                <AdminBadge variant={getStatusBadgeVariant(shipment.status)}>{shipment.status}</AdminBadge>
              </div>
              <div>
                <span className="text-xs text-on-secondary-container block uppercase font-mono tracking-wider">Provider</span>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface-container text-primary-container">
                  {shipment.provider || 'MOCK'}
                </span>
              </div>
            </div>

            {/* Tracking URL Link */}
            {shipment.trackingUrl && (
              <div className="flex items-center justify-between p-3 rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200">
                <span className="font-medium">Live Tracking URL available</span>
                <a
                  href={shipment.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-blue-700 dark:text-blue-300 hover:underline"
                >
                  Track on {shipment.courierName || 'Courier Site'} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {/* Action Bar */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-on-secondary-container">Shipment Operations</span>
              <div className="flex flex-wrap gap-2">
                {capabilities.supportsPickup && (
                  <button
                    onClick={() => setIsPickupModalOpen(true)}
                    disabled={!!actionLoading || shipment.status === 'CANCELLED'}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-outline-variant bg-surface-container hover:bg-outline-variant text-primary-container transition-colors disabled:opacity-50"
                  >
                    <Calendar className="h-3.5 w-3.5" /> Schedule Pickup
                  </button>
                )}

                {capabilities.supportsLabelPDF && (
                  <button
                    onClick={handleGenerateLabel}
                    disabled={actionLoading === 'label'}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-outline-variant bg-surface-container hover:bg-outline-variant text-primary-container transition-colors disabled:opacity-50"
                  >
                    <Download className="h-3.5 w-3.5" /> {actionLoading === 'label' ? 'Generating...' : 'Shipping Label'}
                  </button>
                )}

                {capabilities.supportsInvoicePDF && (
                  <button
                    onClick={handleGenerateInvoice}
                    disabled={actionLoading === 'invoice'}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-outline-variant bg-surface-container hover:bg-outline-variant text-primary-container transition-colors disabled:opacity-50"
                  >
                    <FileText className="h-3.5 w-3.5" /> {actionLoading === 'invoice' ? 'Generating...' : 'Invoice PDF'}
                  </button>
                )}

                {capabilities.supportsReturns && (
                  <button
                    onClick={handleCreateReturn}
                    disabled={actionLoading === 'return'}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-amber-300 text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 transition-colors disabled:opacity-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> {actionLoading === 'return' ? 'Creating...' : 'Create Return Shipment'}
                  </button>
                )}

                {capabilities.supportsCancellation && shipment.status !== 'CANCELLED' && (
                  <button
                    onClick={() => setIsCancelModalOpen(true)}
                    disabled={!!actionLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-red-300 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Cancel Shipment
                  </button>
                )}
              </div>
            </div>

            {/* Shipment Timeline */}
            {timeline.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-outline-variant">
                <span className="text-xs font-semibold uppercase tracking-wider text-on-secondary-container flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" /> Provider Event History
                </span>
                <div className="relative pl-4 border-l-2 border-outline-variant space-y-4">
                  {timeline.map((event, idx) => (
                    <div key={event.id || idx} className="relative text-xs">
                      <span className="absolute -left-[21px] top-0.5 h-2.5 w-2.5 rounded-full bg-primary-container" />
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-primary-container">{event.description || event.status}</span>
                        <span className="text-on-secondary-container font-mono">{new Date(event.occurredAt).toLocaleString('en-IN')}</span>
                      </div>
                      {event.location && <p className="text-on-secondary-container italic mt-0.5">Location: {event.location}</p>}
                      <span className="inline-block mt-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-on-secondary-container">
                        Source: {event.source}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* No shipment created yet — offer Create button */
          <div className="text-center py-6 space-y-3">
            <Package className="h-10 w-10 text-on-secondary-container/40 mx-auto" />
            <p className="text-sm text-on-secondary-container">No shipment record exists for this order yet.</p>
            <button
              onClick={handleCreateShipment}
              disabled={actionLoading === 'create'}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-primary-container text-on-primary hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Truck className="h-4 w-4" /> {actionLoading === 'create' ? 'Creating...' : 'Create Shipment'}
            </button>
          </div>
        )}
      </div>

      {/* Pickup Modal */}
      {isPickupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-xl bg-background border border-outline-variant shadow-xl p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-primary-container">Schedule Courier Pickup</h3>
            <form onSubmit={handleSchedulePickup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-secondary-container mb-1">
                  Pickup Date (Optional)
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full rounded-md border border-outline-variant bg-transparent px-3 py-2 text-sm text-primary-container outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPickupModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md border border-outline-variant text-primary-container hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'pickup'}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md bg-primary-container text-on-primary hover:opacity-90 disabled:opacity-50"
                >
                  {actionLoading === 'pickup' ? 'Scheduling...' : 'Confirm Pickup'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-xl bg-background border border-outline-variant shadow-xl p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-red-700 dark:text-red-400">Cancel Shipment</h3>
            <form onSubmit={handleCancelShipment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-secondary-container mb-1">
                  Cancellation Reason
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                  placeholder="Reason for cancelling shipment with courier..."
                  className="w-full rounded-md border border-outline-variant bg-transparent px-3 py-2 text-sm text-primary-container outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md border border-outline-variant text-primary-container hover:bg-surface-container"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'cancel'}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading === 'cancel' ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
