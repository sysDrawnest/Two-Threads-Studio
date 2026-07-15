import { baseLayout, formatDate } from './_base';

export function shipmentCreatedTemplate(order: any, shipment: any): string {
  const content = `
    <p class="section-label">Shipment Prepared</p>
    <h1 class="title">Your Order is Being Packed</h1>
    <p class="text">
      Wonderful news! Your order <strong>${order.orderNumber}</strong> is being carefully 
      packed by our artisans and will be handed to the courier soon.
    </p>

    <div class="order-box">
      <div class="order-row">
        <span class="order-label">Order Number</span>
        <span class="order-value accent">${order.orderNumber}</span>
      </div>
      <div class="order-row">
        <span class="order-label">Tracking Number</span>
        <span class="order-value" style="font-family:monospace">${shipment.trackingNumber || 'Pending'}</span>
      </div>
      <div class="order-row">
        <span class="order-label">Carrier</span>
        <span class="order-value">${shipment.carrier || 'To be assigned'}</span>
      </div>
      ${shipment.estimatedDelivery ? `
      <div class="order-row">
        <span class="order-label">Estimated Delivery</span>
        <span class="order-value">${formatDate(shipment.estimatedDelivery)}</span>
      </div>` : ''}
    </div>

    <p class="text">
      We will send you another email with tracking details once it is dispatched.
    </p>

    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/account" class="cta-btn">
      View Order Status
    </a>
  `;

  return baseLayout(`Shipment Update — ${order.orderNumber}`, content);
}
