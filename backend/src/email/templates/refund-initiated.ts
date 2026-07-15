import { baseLayout, formatCurrency } from './_base';

export function refundInitiatedTemplate(order: any, refundAmount: number): string {
  const content = `
    <p class="section-label">Refund Initiated</p>
    <h1 class="title">Your Refund is Being Processed</h1>
    <p class="text">
      We have initiated a refund for your order <strong>${order.orderNumber}</strong>. 
      Please allow 5–7 business days for the amount to reflect in your original payment method.
    </p>

    <div class="order-box">
      <div class="order-row">
        <span class="order-label">Order Number</span>
        <span class="order-value accent">${order.orderNumber}</span>
      </div>
      <div class="order-row">
        <span class="order-label">Refund Amount</span>
        <span class="order-value accent">${formatCurrency(refundAmount)}</span>
      </div>
      <div class="order-row">
        <span class="order-label">Refund To</span>
        <span class="order-value">Original Payment Method</span>
      </div>
      <div class="order-row">
        <span class="order-label">Processing Time</span>
        <span class="order-value">5–7 Business Days</span>
      </div>
    </div>

    <p class="text">
      If you have any questions about your refund, please reach out to us at 
      support@twothreadsstudio.com with your order number.
    </p>

    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/account" class="cta-btn">
      View Order Details
    </a>
  `;

  return baseLayout(`Refund Initiated — ${order.orderNumber}`, content);
}
