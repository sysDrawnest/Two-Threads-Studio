import { baseLayout, formatCurrency } from './_base';

export function paymentFailedTemplate(order: any, reason?: string): string {
  const content = `
    <p class="section-label">Payment Failed</p>
    <h1 class="title">We Couldn't Process Your Payment</h1>
    <p class="text">
      Unfortunately, your payment for order <strong>${order.orderNumber}</strong> could not be 
      processed. No amount has been deducted from your account.
    </p>

    <div class="order-box">
      <div class="order-row">
        <span class="order-label">Order Number</span>
        <span class="order-value accent">${order.orderNumber}</span>
      </div>
      <div class="order-row">
        <span class="order-label">Amount</span>
        <span class="order-value">${formatCurrency(order.grandTotal)}</span>
      </div>
      ${reason ? `
      <div class="order-row">
        <span class="order-label">Reason</span>
        <span class="order-value" style="color:#A34A38">${reason}</span>
      </div>` : ''}
    </div>

    <p class="text">
      Your cart has been preserved. Please try again using a different payment method 
      or contact your bank if the issue persists.
    </p>

    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout" class="cta-btn" 
       style="background:#A34A38">
      Retry Payment
    </a>

    <p class="text" style="font-size:11px;color:#888">
      If the problem persists, please contact us at support@twothreadsstudio.com 
      with your order number.
    </p>
  `;

  return baseLayout(`Payment Failed — ${order.orderNumber}`, content);
}
