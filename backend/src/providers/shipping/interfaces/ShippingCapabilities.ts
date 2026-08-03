/**
 * ShippingCapabilities
 *
 * Every ShippingProvider must declare which operations it supports.
 * The Admin UI and ShippingService use this map to:
 *  - Hide unsupported action buttons automatically
 *  - Guard against calling unsupported provider methods
 *
 * When adding a new provider, implement only its supported capabilities.
 * The interface does NOT force providers to implement unsupported features.
 */

export interface ShippingCapabilities {
  /** Can book a courier pickup from the fulfillment location */
  supportsPickup: boolean;
  /** Can generate a consolidated manifest PDF for multi-order pickups */
  supportsManifest: boolean;
  /** Can create a reverse logistics (return) shipment */
  supportsReturns: boolean;
  /** Can generate a shipping label PDF */
  supportsLabelPDF: boolean;
  /** Can generate a printable invoice PDF */
  supportsInvoicePDF: boolean;
  /** Supports COD (Cash on Delivery) shipments */
  supportsCOD: boolean;
  /** Can provide insurance coverage on shipments */
  supportsInsurance: boolean;
  /** Can check live rate estimates before creating a shipment */
  supportsRateEstimation: boolean;
  /** Can check whether a pincode is serviceable before booking */
  supportsServiceabilityCheck: boolean;
  /** Can cancel an active shipment */
  supportsCancellation: boolean;
  /** Supports Shiprocket/Delhivery-style status webhooks */
  supportsWebhook: boolean;
  /** Can return a ranked list of courier recommendations */
  supportsCourierRecommendation: boolean;
  /** Supports Non-Delivery Report (NDR) management */
  supportsNDR: boolean;
}

/** Helper to build a zero-capability baseline for new providers */
export const NO_CAPABILITIES: ShippingCapabilities = {
  supportsPickup: false,
  supportsManifest: false,
  supportsReturns: false,
  supportsLabelPDF: false,
  supportsInvoicePDF: false,
  supportsCOD: false,
  supportsInsurance: false,
  supportsRateEstimation: false,
  supportsServiceabilityCheck: false,
  supportsCancellation: false,
  supportsWebhook: false,
  supportsCourierRecommendation: false,
  supportsNDR: false,
};
