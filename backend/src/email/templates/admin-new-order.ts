import { baseLayout, formatCurrency, formatDate } from './_base';

export function adminNewOrderTemplate(order: any): string {
  const customerRisk = order.user?.customerRisk || {};
  const isRisky = customerRisk.trustScore < 40 || customerRisk.isBlocked || order.paymentMethod === 'COD' && customerRisk.trustScore < 60;
  const riskBadge = isRisky 
    ? `<span style="background-color:#ffebeb;color:#d32f2f;padding:2px 6px;border-radius:4px;font-weight:bold;font-size:12px;">HIGH</span>` 
    : `<span style="background-color:#e8f5e9;color:#2e7d32;padding:2px 6px;border-radius:4px;font-weight:bold;font-size:12px;">LOW</span>`;

  const itemRows = (order.items || [])
    .map(
      (item: any) => `
      <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.productName}</strong><br/>
        <span style="color:#6B6B6B;font-size:12px;">Qty: ${item.quantity}</span> | 
        <strong style="color:#1C1C1B;font-size:12px;">${formatCurrency(item.lineTotal)}</strong>
        ${item.variantName ? `<br/><span style="color:#6B6B6B;font-size:11px">Variant: ${item.variantName}</span>` : ''}
        ${item.sku ? `<br/><span style="color:#6B6B6B;font-size:11px">SKU: ${item.sku}</span>` : ''}
        ${item.customization?.hoopFinish ? `<br/><span style="color:#6B6B6B;font-size:11px">Hoop: ${item.customization.hoopFinish}</span>` : ''}
        ${item.engravingText ? `<br/><span style="color:#A34A38;font-size:11px">Engraved: "${item.engravingText}"</span>` : ''}
        ${item.giftWrap ? `<br/><span style="color:#A34A38;font-size:11px;font-weight:bold;">Gift Wrap Requested</span>` : ''}
      </div>`
    )
    .join('');

  const content = `
    <div style="background-color: #fff; border: 2px solid ${isRisky ? '#d32f2f' : '#1C1C1B'}; padding: 24px; border-radius: 8px;">
      <p style="font-family: monospace; font-size: 10px; letter-spacing: 0.1em; color: ${isRisky ? '#d32f2f' : '#6B6B6B'}; text-transform: uppercase; margin: 0 0 16px 0;">
        NEW ORDER RECEIVED
      </p>
      
      <h2 style="margin: 0 0 24px 0; font-family: serif; font-size: 24px; font-weight: normal; border-bottom: 1px solid #1C1C1B; padding-bottom: 16px;">
        Order #${order.orderNumber}
      </h2>

      <h3 style="font-family: sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 24px 0 8px 0; color: #1C1C1B;">
        Customer
      </h3>
      <div style="font-size: 13px; line-height: 1.5; color: #444;">
        <strong>${order.user?.firstName || ''} ${order.user?.lastName || ''}</strong><br/>
        Phone: ${order.user?.phone || 'N/A'}<br/>
        Email: ${order.user?.email || 'N/A'}<br/>
      </div>

      <h3 style="font-family: sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 24px 0 8px 0; color: #1C1C1B;">
        Products
      </h3>
      <div>
        ${itemRows}
      </div>

      <h3 style="font-family: sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 24px 0 8px 0; color: #1C1C1B;">
        Payment & Totals
      </h3>
      <table style="width: 100%; font-size: 13px; color: #444; border-collapse: collapse;">
        <tr>
          <td style="padding: 4px 0;">Method</td>
          <td style="padding: 4px 0; text-align: right; font-weight: bold;">${order.paymentMethod} ${order.paymentMethod === 'ONLINE' ? '✅' : ''}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;">Status</td>
          <td style="padding: 4px 0; text-align: right;">${order.paymentStatus}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;">Subtotal</td>
          <td style="padding: 4px 0; text-align: right;">${formatCurrency(order.subtotal || 0)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;">Shipping</td>
          <td style="padding: 4px 0; text-align: right;">${formatCurrency(order.shippingCharges || 0)}</td>
        </tr>
        ${order.discountAmount > 0 ? `
        <tr>
          <td style="padding: 4px 0; color: #2e7d32;">Discount</td>
          <td style="padding: 4px 0; text-align: right; color: #2e7d32;">-${formatCurrency(order.discountAmount)}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 8px 0; border-top: 1px solid #eee; font-weight: bold; font-size: 15px;">Grand Total</td>
          <td style="padding: 8px 0; border-top: 1px solid #eee; text-align: right; font-weight: bold; font-size: 15px; color: #A34A38;">
            ${formatCurrency(order.grandTotal)}
          </td>
        </tr>
      </table>

      <h3 style="font-family: sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 24px 0 8px 0; color: #1C1C1B;">
        Shipping Address
      </h3>
      <div style="font-size: 13px; line-height: 1.5; color: #444; background: #f9f9f9; padding: 12px; border-radius: 4px;">
        <strong>${order.shippingAddress?.fullName || 'N/A'}</strong><br/>
        ${order.shippingAddress?.line1 || ''} ${order.shippingAddress?.line2 || ''}<br/>
        ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - <strong>${order.shippingAddress?.postalCode || ''}</strong><br/>
        Phone: ${order.shippingAddress?.phone || 'N/A'}
      </div>

      <h3 style="font-family: sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 24px 0 8px 0; color: #1C1C1B;">
        Fraud & Risk Information
      </h3>
      <table style="width: 100%; font-size: 13px; color: #444; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 4px 0;">Trust Score</td>
          <td style="padding: 4px 0; text-align: right; font-weight: bold;">${customerRisk.trustScore ?? 'N/A'} / 100</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;">Risk Level</td>
          <td style="padding: 4px 0; text-align: right;">${riskBadge}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;">Previous Orders</td>
          <td style="padding: 4px 0; text-align: right;">${customerRisk.ordersPlaced ?? 0}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;">Previous RTOs</td>
          <td style="padding: 4px 0; text-align: right;">${customerRisk.rtoCount ?? 0}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;">Manual Review Required</td>
          <td style="padding: 4px 0; text-align: right; font-weight: bold; color: ${order.status === 'PENDING' && isRisky ? '#A34A38' : '#1C1C1B'}">
            ${order.status === 'PENDING' && isRisky ? 'YES' : 'NO'}
          </td>
        </tr>
      </table>

      <div style="text-align: center; border-top: 1px solid #1C1C1B; padding-top: 24px;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/orders/${order.id}" 
           style="display: inline-block; background: #1C1C1B; color: #fff; text-decoration: none; padding: 12px 24px; font-family: sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 4px;">
          View in Admin Dashboard
        </a>
      </div>
    </div>
  `;

  // We can bypass baseLayout or wrap it inside it. Given baseLayout has "Two Threads Studio" header, it's fine.
  return baseLayout(`Admin Alert — New Order ${order.orderNumber}`, content);
}
