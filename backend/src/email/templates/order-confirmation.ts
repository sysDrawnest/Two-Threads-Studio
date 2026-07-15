import { baseLayout, formatCurrency, formatDate } from './_base';

export function orderConfirmationTemplate(order: any): string {
  const itemRows = (order.items || [])
    .map(
      (item: any) => `
      <tr>
        <td>
          <strong>${item.productName}</strong>
          ${item.variantName ? `<br/><span style="color:#6B6B6B;font-size:11px">${item.variantName}</span>` : ''}
          ${item.engravingText ? `<br/><span style="color:#A34A38;font-size:11px">Engraved: "${item.engravingText}"</span>` : ''}
        </td>
        <td style="text-align:center">${item.quantity}</td>
        <td style="text-align:right">${formatCurrency(item.lineTotal)}</td>
      </tr>`
    )
    .join('');

  const content = `
    <p class="section-label">Order Received</p>
    <h1 class="title">Thank You for Your Order</h1>
    <p class="text">
      Your order has been received with gratitude. Our artisans will begin preparing your 
      handcrafted pieces shortly. You will receive another email once payment is confirmed.
    </p>

    <div class="order-box">
      <div class="order-row">
        <span class="order-label">Order Number</span>
        <span class="order-value accent">${order.orderNumber}</span>
      </div>
      <div class="order-row">
        <span class="order-label">Order Date</span>
        <span class="order-value">${formatDate(order.createdAt)}</span>
      </div>
      <div class="order-row">
        <span class="order-label">Payment Method</span>
        <span class="order-value">${order.paymentMethod}</span>
      </div>
      <div class="order-row">
        <span class="order-label">Total</span>
        <span class="order-value accent">${formatCurrency(order.grandTotal)}</span>
      </div>
    </div>

    <div class="divider"></div>
    <p class="section-label">Items Ordered</p>
    <table class="items">
      <thead>
        <tr>
          <th>Product</th>
          <th style="text-align:center">Qty</th>
          <th style="text-align:right">Total</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <div class="divider"></div>
    <p class="section-label">Shipping To</p>
    <p class="text" style="margin-bottom:4px"><strong>${order.shippingAddress?.fullName}</strong></p>
    <p class="text">
      ${order.shippingAddress?.line1}${order.shippingAddress?.line2 ? ', ' + order.shippingAddress.line2 : ''}<br/>
      ${order.shippingAddress?.city}, ${order.shippingAddress?.state} — ${order.shippingAddress?.postalCode}
    </p>

    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/account" class="cta-btn">
      View Your Order
    </a>

    <p class="text" style="font-size:11px;color:#888">
      A PDF invoice is attached to this email for your records.
    </p>
  `;

  return baseLayout(`Order Confirmation — ${order.orderNumber}`, content);
}
