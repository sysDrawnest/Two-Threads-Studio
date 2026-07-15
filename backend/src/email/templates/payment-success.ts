import { baseLayout, formatCurrency, formatDate } from './_base';

export function paymentSuccessTemplate(order: any, payment: any): string {
  const content = `
    <p class="section-label">Payment Confirmed</p>
    <h1 class="title">Payment Successful 🎉</h1>
    <p class="text">
      Your payment has been successfully received. Our artisans will now begin 
      handcrafting your order with the utmost care and attention to detail.
    </p>

    <div class="order-box">
      <div class="order-row">
        <span class="order-label">Order Number</span>
        <span class="order-value accent">${order.orderNumber}</span>
      </div>
      <div class="order-row">
        <span class="order-label">Payment ID</span>
        <span class="order-value" style="font-family:monospace;font-size:11px">${payment.providerPaymentId || '—'}</span>
      </div>
      <div class="order-row">
        <span class="order-label">Amount Paid</span>
        <span class="order-value accent">${formatCurrency(payment.amount)}</span>
      </div>
      <div class="order-row">
        <span class="order-label">Payment Method</span>
        <span class="order-value">${payment.method || order.paymentMethod}</span>
      </div>
      <div class="order-row">
        <span class="order-label">Paid At</span>
        <span class="order-value">${payment.paidAt ? formatDate(payment.paidAt) : formatDate(new Date())}</span>
      </div>
    </div>

    <p class="text">
      You will receive a shipping notification once your order is dispatched. 
      Estimated delivery time is <strong>3–5 business days</strong> from today.
    </p>

    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/account" class="cta-btn">
      Track Your Order
    </a>
  `;

  return baseLayout(`Payment Confirmed — ${order.orderNumber}`, content);
}
