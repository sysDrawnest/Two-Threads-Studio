import { baseLayout, formatDate } from './_base';

export function deliveredTemplate(order: any): string {
  const content = `
    <p class="section-label">Delivered</p>
    <h1 class="title">Your Order Has Arrived ✨</h1>
    <p class="text">
      Your handcrafted pieces from Two Threads Studio have been delivered. 
      We hope you love every stitch and detail as much as our artisans put into making them.
    </p>

    <div class="order-box">
      <div class="order-row">
        <span class="order-label">Order Number</span>
        <span class="order-value accent">${order.orderNumber}</span>
      </div>
      <div class="order-row">
        <span class="order-label">Delivered On</span>
        <span class="order-value">${formatDate(new Date())}</span>
      </div>
    </div>

    <p class="text" style="font-style:italic;color:#A34A38">
      "Every piece carries the warmth of hands that shaped it — we are grateful you chose slow craft."
    </p>

    <div class="divider"></div>

    <p class="text">
      We would be honoured if you shared your experience. Your review helps our 
      artisan community grow and supports sustainable handcraft.
    </p>

    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/account" class="cta-btn">
      Write a Review
    </a>
  `;

  return baseLayout(`Delivered — ${order.orderNumber}`, content);
}
