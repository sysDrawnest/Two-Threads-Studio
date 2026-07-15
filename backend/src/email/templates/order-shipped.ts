import { baseLayout, formatDate } from './_base';

export function orderShippedTemplate(order: any, shipment: any): string {
  const content = `
    <p class="section-label">On Its Way</p>
    <h1 class="title">Your Order Has Shipped 🚚</h1>
    <p class="text">
      Your handcrafted pieces are on their way to you! Here are your tracking details.
    </p>

    <div class="order-box">
      <div class="order-row">
        <span class="order-label">Order Number</span>
        <span class="order-value accent">${order.orderNumber}</span>
      </div>
      <div class="order-row">
        <span class="order-label">Tracking Number</span>
        <span class="order-value" style="font-family:monospace">${shipment.trackingNumber}</span>
      </div>
      <div class="order-row">
        <span class="order-label">Carrier</span>
        <span class="order-value">${shipment.carrier}</span>
      </div>
      <div class="order-row">
        <span class="order-label">Shipped At</span>
        <span class="order-value">${shipment.shippedAt ? formatDate(shipment.shippedAt) : formatDate(new Date())}</span>
      </div>
      ${shipment.estimatedDelivery ? `
      <div class="order-row">
        <span class="order-label">Estimated Delivery</span>
        <span class="order-value">${formatDate(shipment.estimatedDelivery)}</span>
      </div>` : ''}
    </div>

    <p class="text">
      Use your tracking number to follow your package on the carrier's website.
      Once delivered, we would love to hear your feedback.
    </p>

    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/account" class="cta-btn">
      Track Shipment
    </a>
  `;

  return baseLayout(`Your Order is Shipped — ${order.orderNumber}`, content);
}
