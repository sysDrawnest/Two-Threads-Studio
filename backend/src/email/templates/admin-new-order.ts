import { baseLayout, formatCurrency, formatDate } from './_base';

export function adminNewOrderTemplate(order: any): string {
  const customerRisk = order.user?.customerRisk || {};
  const trustScore = customerRisk.trustScore ?? 50;
  const isRisky = trustScore < 40 || customerRisk.isBlocked || (order.paymentMethod === 'COD' && trustScore < 60);
  
  const highValueThreshold = parseInt(process.env.HIGH_VALUE_ORDER_THRESHOLD_INR || '5000', 10);
  const isHighValue = Number(order.grandTotal) >= highValueThreshold;
  
  const adminUrl = process.env.ADMIN_FRONTEND_URL || 'https://admin.twothreadsstudio.com';
  const orderDeepLink = `${adminUrl}/orders/${order.orderNumber}`;

  // Badges & Risk Summary
  let riskBadgeHtml = '';
  if (trustScore >= 80 && !isRisky) {
    riskBadgeHtml = `<div style="background:#e8f5e9;color:#2e7d32;padding:12px;border-radius:6px;margin-bottom:16px;">
      <h3 style="margin:0 0 8px 0;font-size:16px;">🟢 Safe Customer</h3>
      <div style="font-size:14px;">Trust Score ${trustScore}<br/>${customerRisk.rtoCount || 0} RTO<br/>${customerRisk.ordersDelivered || 0} Successful Orders</div>
    </div>`;
  } else if (trustScore >= 40 && !isRisky) {
    riskBadgeHtml = `<div style="background:#fff8e1;color:#f57f17;padding:12px;border-radius:6px;margin-bottom:16px;">
      <h3 style="margin:0 0 8px 0;font-size:16px;">🟡 Medium Risk</h3>
      <div style="font-size:14px;">Trust Score ${trustScore}<br/>${customerRisk.rtoCount || 0} RTO</div>
    </div>`;
  } else {
    riskBadgeHtml = `<div style="background:#ffebee;color:#c62828;padding:12px;border-radius:6px;margin-bottom:16px;">
      <h3 style="margin:0 0 8px 0;font-size:16px;">🔴 HIGH RISK</h3>
      <div style="font-size:14px;font-weight:bold;">Trust Score ${trustScore}<br/>${customerRisk.rtoCount || 0} RTO<br/>${order.paymentMethod}<br/>Manual Review Required</div>
    </div>`;
  }

  // Items
  const itemRows = (order.items || [])
    .map((item: any) => {
      // Use the fetched stock count or fallback to 0
      const stock = item.product?.stockQuantity ?? 0;
      const lowStockThreshold = item.product?.lowStockThreshold ?? 5;
      
      const inventoryWarning = stock <= lowStockThreshold
        ? `<div style="margin-top:8px;background:#fff3e0;color:#e65100;padding:6px;border-radius:4px;font-size:12px;font-weight:bold;text-align:center;">
             ⚠ Remaining Stock : ${stock}<br/>Restock Immediately
           </div>`
        : '';

      return `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-bottom: 1px solid #eee; margin-bottom: 24px; border-collapse: collapse;">
        <tr>
          <td style="width: 96px; vertical-align: top; padding-right: 16px; padding-bottom: 24px;">
            ${item.productImage ? `<img src="${item.productImage}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; display: block;" alt="Product"/>` : ''}
          </td>
          <td style="vertical-align: top; padding-bottom: 24px;">
            <strong style="font-size:16px;color:#1C1C1B;">${item.productName}</strong><br/>
            <span style="color:#6B6B6B;font-size:14px;">Qty: ${item.quantity}</span><br/>
            <strong style="color:#A34A38;font-size:14px;">${formatCurrency(item.unitPrice || item.lineTotal / item.quantity)} × ${item.quantity} = ${formatCurrency(item.lineTotal)}</strong>
            ${item.variantName ? `<br/><span style="color:#444;font-size:13px;display:inline-block;margin-top:4px;">Variant: <strong>${item.variantName}</strong></span>` : ''}
            ${item.sku ? `<br/><span style="color:#444;font-size:13px;">SKU: ${item.sku}</span>` : ''}
            ${item.customization?.hoopFinish ? `<br/><span style="color:#444;font-size:13px;">Hoop: <strong>${item.customization.hoopFinish}</strong></span>` : ''}
            ${item.engravingText ? `<br/><span style="color:#A34A38;font-size:13px;font-weight:bold;">Engraved: "${item.engravingText}"</span>` : ''}
            ${item.giftWrap ? `<br/><span style="color:#A34A38;font-size:13px;font-weight:bold;">🎁 Gift Wrap Requested</span>` : ''}
            ${inventoryWarning}
          </td>
        </tr>
      </table>`;
    })
    .join('');

  // Map Links
  const encodedAddress = encodeURIComponent(`${order.shippingAddress?.line1 || ''} ${order.shippingAddress?.city || ''} ${order.shippingAddress?.postalCode || ''}`);

  const content = `
    <div style="background-color: #fff; padding: 24px 16px; border-radius: 8px; font-family: sans-serif; font-size: 16px; color: #1C1C1B; max-width: 600px; margin: auto;">
      
      ${isHighValue ? `<div style="background:#000;color:#fff;padding:12px;text-align:center;font-weight:bold;margin-bottom:16px;border-radius:4px;letter-spacing:0.05em;">🚨 HIGH VALUE ORDER</div>` : ''}
      
      ${riskBadgeHtml}
      
      <h2 style="margin: 0 0 24px 0; font-family: serif; font-size: 24px; font-weight: normal; border-bottom: 2px solid #1C1C1B; padding-bottom: 16px;">
        Order #${order.orderNumber}
      </h2>

      <!-- CUSTOMER INFO -->
      <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 24px 0 8px 0; color: #666;">
        Customer
      </h3>
      <div style="background: #fafafa; padding: 16px; border-radius: 6px;">
        <strong style="font-size: 18px;">${order.user?.firstName || ''} ${order.user?.lastName || ''}</strong><br/>
        <div style="margin-top:8px;">
          Email: <a href="mailto:${order.user?.email}" style="color:#A34A38;">${order.user?.email || 'N/A'}</a><br/>
          Phone: <a href="tel:${order.user?.phone}" style="color:#A34A38;">${order.user?.phone || 'N/A'}</a>
        </div>
        <div style="margin-top:12px;">
          <a href="tel:${order.user?.phone}" style="display:inline-block;background:#eee;color:#1C1C1B;padding:8px 16px;border-radius:4px;text-decoration:none;font-weight:bold;font-size:14px;">📞 Call Customer</a>
        </div>
      </div>

      <!-- PRODUCTS -->
      <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 24px 0 8px 0; color: #666;">
        Products
      </h3>
      <div>
        ${itemRows}
      </div>

      <!-- PAYMENT & TOTALS -->
      <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 24px 0 8px 0; color: #666;">
        Payment & Totals
      </h3>
      <table style="width: 100%; font-size: 16px; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0;">Method</td>
          <td style="padding: 6px 0; text-align: right; font-weight: bold;">${order.paymentMethod} ${order.paymentMethod === 'ONLINE' ? '✅' : ''}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0;">Status</td>
          <td style="padding: 6px 0; text-align: right;">${order.paymentStatus}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0;">Coupon</td>
          <td style="padding: 6px 0; text-align: right; font-weight:bold;">${order.couponCode || 'None'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0;">Subtotal</td>
          <td style="padding: 6px 0; text-align: right;">${formatCurrency(order.subtotal || 0)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0;">Shipping</td>
          <td style="padding: 6px 0; text-align: right;">${formatCurrency(order.shippingCharges || 0)}</td>
        </tr>
        ${order.discountAmount > 0 ? `
        <tr>
          <td style="padding: 6px 0; color: #2e7d32;">Discount</td>
          <td style="padding: 6px 0; text-align: right; color: #2e7d32;">-${formatCurrency(order.discountAmount)}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 12px 0; border-top: 1px solid #1C1C1B; font-weight: bold; font-size: 18px;">Grand Total</td>
          <td style="padding: 12px 0; border-top: 1px solid #1C1C1B; text-align: right; font-weight: bold; font-size: 18px; color: #A34A38;">
            ${formatCurrency(order.grandTotal)}
          </td>
        </tr>
      </table>

      <!-- SHIPPING ADDRESS -->
      <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 24px 0 8px 0; color: #666;">
        Shipping Address
      </h3>
      <div style="background: #fafafa; padding: 16px; border-radius: 6px; line-height: 1.5;">
        <strong>${order.shippingAddress?.fullName || 'N/A'}</strong><br/>
        ${order.shippingAddress?.line1 || ''} ${order.shippingAddress?.line2 || ''}<br/>
        ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - <strong>${order.shippingAddress?.postalCode || ''}</strong><br/>
        Phone: ${order.shippingAddress?.phone || 'N/A'}
        <div style="margin-top:12px;">
          <a href="https://maps.google.com/?q=${encodedAddress}" target="_blank" style="display:inline-block;background:#e3f2fd;color:#1565c0;padding:8px 16px;border-radius:4px;text-decoration:none;font-weight:bold;font-size:14px;">📍 Open in Google Maps</a>
        </div>
      </div>

      <!-- PACKING CHECKLIST -->
      <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 24px 0 8px 0; color: #666;">
        Packing Checklist
      </h3>
      <div style="background: #fff; border:1px solid #ddd; padding: 16px; border-radius: 6px; line-height: 2;">
        <div style="margin-bottom:8px;">□ Product(s)</div>
        <div style="margin-bottom:8px;">□ Invoice</div>
        <div style="margin-bottom:8px;">□ Thank You Card</div>
        <div style="margin-bottom:8px;">□ Gift Wrap (if requested)</div>
        <div style="margin-bottom:8px;">□ Engraving Checked</div>
        <div>□ QC Passed</div>
      </div>

      <!-- TIMELINE & METADATA -->
      <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 32px 0 8px 0; color: #666;">
        Timeline & Metadata
      </h3>
      <div style="font-size: 14px; color: #555; background: #fafafa; padding: 16px; border-radius: 6px; font-family: monospace;">
        <div><strong>${formatDate(order.createdAt)}</strong> - Order Placed</div>
        ${order.paidAt ? `<div><strong>${formatDate(order.paidAt)}</strong> - Payment Verified</div>` : ''}
        
        <hr style="border:none;border-top:1px dashed #ddd;margin:12px 0;" />
        
        <div style="color:#888;">
          Device: Not recorded<br/>
          IP: Not recorded<br/>
          Source: Direct / Unknown
        </div>
      </div>

      <!-- ACTIONS -->
      <div style="text-align: center; border-top: 1px solid #eee; padding-top: 24px; margin-top: 32px;">
        <a href="${orderDeepLink}" 
           style="display: block; background: #1C1C1B; color: #fff; text-decoration: none; padding: 16px; font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 4px; margin-bottom: 12px;">
          Open Order in Dashboard
        </a>
        <a href="#" onclick="window.print();return false;"
           style="display: block; background: #f0f0f0; color: #1C1C1B; text-decoration: none; padding: 16px; font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 4px;">
          Print Packing Slip
        </a>
      </div>
    </div>
  `;

  return baseLayout('', content);
}
