/**
 * Shared email base layout and helpers for Two Threads Studio transactional emails.
 */

export const colors = {
  primary: '#1C1C1B',
  accent: '#A34A38',
  bg: '#FAF9F7',
  border: '#E5E0D8',
  muted: '#6B6B6B',
  white: '#FFFFFF',
};

export function baseLayout(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: ${colors.bg}; font-family: Georgia, 'Times New Roman', serif; color: ${colors.primary}; }
    .wrapper { max-width: 600px; margin: 40px auto; background: ${colors.white}; border: 1px solid ${colors.border}; }
    .header { background: ${colors.primary}; padding: 32px 40px; text-align: center; }
    .header-brand { color: ${colors.white}; font-size: 18px; letter-spacing: 0.25em; text-transform: uppercase; }
    .header-tagline { color: ${colors.accent}; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; margin-top: 6px; font-family: Arial, sans-serif; }
    .body { padding: 40px; }
    .section-label { font-family: Arial, sans-serif; font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: ${colors.muted}; margin-bottom: 8px; }
    .title { font-size: 22px; font-weight: normal; color: ${colors.primary}; margin-bottom: 16px; }
    .text { font-family: Arial, sans-serif; font-size: 13px; line-height: 1.7; color: ${colors.muted}; margin-bottom: 16px; }
    .divider { height: 1px; background: ${colors.border}; margin: 28px 0; }
    .order-box { background: ${colors.bg}; border: 1px solid ${colors.border}; padding: 20px; margin: 20px 0; }
    .order-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid ${colors.border}; font-family: Arial, sans-serif; font-size: 12px; }
    .order-row:last-child { border-bottom: none; }
    .order-label { color: ${colors.muted}; }
    .order-value { color: ${colors.primary}; font-weight: bold; }
    .order-value.accent { color: ${colors.accent}; }
    .cta-btn { display: block; background: ${colors.primary}; color: ${colors.white}; text-align: center; padding: 14px 32px; text-decoration: none; font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin: 28px 0; }
    .footer { background: ${colors.primary}; padding: 24px 40px; text-align: center; }
    .footer-text { color: #888; font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 0.1em; line-height: 1.8; }
    .footer-brand { color: ${colors.white}; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px; }
    table.items { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 12px; }
    table.items th { background: ${colors.bg}; color: ${colors.muted}; font-weight: normal; text-align: left; padding: 8px; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 1px solid ${colors.border}; }
    table.items td { padding: 10px 8px; border-bottom: 1px solid ${colors.border}; color: ${colors.primary}; vertical-align: top; }
    .badge { display: inline-block; padding: 3px 10px; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; font-family: Arial, sans-serif; }
    .badge-success { background: #E6F4EA; color: #1E7E34; }
    .badge-error { background: #FDE8E4; color: #A34A38; }
    .badge-info { background: #E8F0FE; color: #1A56DB; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <div class="header-brand">Two Threads Studio</div>
    <div class="header-tagline">Slow Craft · Sacred Traditions · Handmade with Intention</div>
  </div>
  <div class="body">
    ${content}
  </div>
  <div class="footer">
    <div class="footer-brand">Two Threads Studio</div>
    <div class="footer-text">
      A Brand of SYS Pvt. Ltd.<br/>
      Handmade in India · support@twothreadsstudio.com<br/>
      You are receiving this because you placed an order with us.
    </div>
  </div>
</div>
</body>
</html>`;
}

export function formatCurrency(amount: number | string): string {
  return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}
