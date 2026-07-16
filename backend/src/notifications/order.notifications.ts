/**
 * Order Notifications
 *
 * Orchestrates transactional emails for all order, payment, and shipment events.
 * Calls emailService.send() — never calls Resend or Razorpay directly.
 *
 * Structured to be easily swapped for a BullMQ queue later:
 *   - Replace each function body with queue.add(jobName, payload)
 *   - Keep the same function signatures — callers need not change.
 */

import logger from '../lib/logger';
import { emailService } from '../email/email.service';
import { invoiceService } from '../services/invoice.service';
import { orderConfirmationTemplate } from '../email/templates/order-confirmation';
import { paymentSuccessTemplate } from '../email/templates/payment-success';
import { paymentFailedTemplate } from '../email/templates/payment-failed';
import { shipmentCreatedTemplate } from '../email/templates/shipment-created';
import { orderShippedTemplate } from '../email/templates/order-shipped';
import { deliveredTemplate } from '../email/templates/delivered';
import { refundInitiatedTemplate } from '../email/templates/refund-initiated';

import { adminNewOrderTemplate } from '../email/templates/admin-new-order';
import prisma from '../prisma';

function getCustomerEmail(order: any): string | null {
  return order.user?.email || null;
}

const sendCustomerOrderConfirmation = async (order: any, attachments?: any[]) => {
  const email = getCustomerEmail(order);
  if (!email) return;

  try {
    await emailService.send({
      to: email,
      subject: `Order Confirmation — ${order.orderNumber}`,
      html: orderConfirmationTemplate(order),
      attachments,
    });
  } catch (err) {
    logger.error({ err, orderId: order.id }, 'Failed to send customer order confirmation email');
  }
};

const sendAdminOrderNotification = async (order: any, attachments?: any[]) => {
  const adminEmailsStr = process.env.ADMIN_NOTIFICATION_EMAILS || 'sethysaiyangyadatta@gmail.com,shreyasisahoo116@gmail.com';
  const adminEmails = adminEmailsStr.split(',').map(e => e.trim()).filter(Boolean);
  
  const highValueThreshold = parseInt(process.env.HIGH_VALUE_ORDER_THRESHOLD_INR || '5000', 10);
  const isHighValue = Number(order.grandTotal) >= highValueThreshold;
  
  const customerRisk = order.user?.customerRisk || {};
  const isHighRisk = (customerRisk.trustScore ?? 50) < 40;

  let subject = '';
  const priceFormatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(order.grandTotal);
  
  if (order.paymentMethod === 'COD' && isHighRisk) {
    subject = `🔴 COD HIGH RISK • Order #${order.orderNumber} • ${priceFormatted}`;
  } else if (isHighValue) {
    subject = `🚨 HIGH VALUE ORDER • Order #${order.orderNumber} • ${priceFormatted}`;
  } else if (order.paymentMethod === 'PREPAID' || order.paymentMethod === 'ONLINE') {
    subject = `🟢 PREPAID • Order #${order.orderNumber} • ${priceFormatted}`;
  } else {
    subject = `🟠 COD • Order #${order.orderNumber} • ${priceFormatted}`;
  }

  try {
    // Fetch stock quantities for inventory warning
    const productIds = order.items?.map((i: any) => i.productId).filter(Boolean) || [];
    let products: any[] = [];
    if (productIds.length > 0) {
      products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, stockQuantity: true, lowStockThreshold: true }
      });
    }
    
    // Log low stock warnings
    products.forEach((p) => {
      const threshold = p.lowStockThreshold || 5;
      if (p.stockQuantity <= threshold) {
        logger.warn({
          type: 'low_stock',
          product: p.name,
          remaining: p.stockQuantity,
          threshold,
        });
      }
    });
    
    const enrichedOrder = {
      ...order,
      items: order.items?.map((item: any) => ({
        ...item,
        product: products.find(p => p.id === item.productId)
      })) || []
    };

    const startTime = Date.now();
    const results = await Promise.allSettled(adminEmails.map(email => 
      emailService.send({
        to: email,
        subject,
        html: adminNewOrderTemplate(enrichedOrder),
        attachments,
      })
    ));
    const duration = Date.now() - startTime;
    const sentCount = results.filter(r => r.status === 'fulfilled').length;

    logger.info({
      type: 'email_sent',
      template: 'Admin Order Notification',
      recipients: adminEmails.length,
      status: sentCount > 0 ? 'SUCCESS' : 'FAILED',
      time: duration,
    });
  } catch (err) {
    logger.error({ err, orderId: order.id }, 'Failed to send admin order notification email');
  }
};

export const orderNotifications = {
  // ───── Order lifecycle ─────────────────────────────────────────────────────

  onOrderCreated: async (order: any): Promise<void> => {
    logger.info({ orderId: order.id, orderNumber: order.orderNumber }, '🔔 Notification: order.created');

    let attachments: Array<{ filename: string; content: Buffer; contentType: string }> | undefined;
    try {
      const pdfBytes = await invoiceService.generateInvoicePdf(order);
      attachments = [{
        filename: `invoice_${order.orderNumber}.pdf`,
        content: Buffer.from(pdfBytes),
        contentType: 'application/pdf',
      }];
    } catch (pdfErr) {
      logger.warn({ pdfErr }, 'PDF invoice generation failed; sending email without attachment');
    }

    // Send emails in parallel
    await Promise.allSettled([
      sendCustomerOrderConfirmation(order, attachments),
      sendAdminOrderNotification(order, attachments)
    ]);
  },

  onOrderConfirmed: async (order: any): Promise<void> => {
    logger.info({ orderId: order.id }, '🔔 Notification: order.confirmed');
    // Confirmation email is sent on creation; no duplicate needed here unless business wants it
  },

  onOrderShipped: async (order: any, shipment?: any): Promise<void> => {
    logger.info({ orderId: order.id }, '🔔 Notification: order.shipped');

    const email = getCustomerEmail(order);
    if (!email) return;

    await emailService.send({
      to: email,
      subject: `Your Order Has Shipped — ${order.orderNumber}`,
      html: orderShippedTemplate(order, shipment || order.shipment || {}),
    });
  },

  onOrderDelivered: async (order: any): Promise<void> => {
    logger.info({ orderId: order.id }, '🔔 Notification: order.delivered');

    const email = getCustomerEmail(order);
    if (!email) return;

    await emailService.send({
      to: email,
      subject: `Your Order Has Arrived — ${order.orderNumber}`,
      html: deliveredTemplate(order),
    });
  },

  // ───── Payment events ──────────────────────────────────────────────────────

  onPaymentCaptured: async (order: any, payment: any): Promise<void> => {
    logger.info({ orderId: order.id, paymentId: payment.id }, '🔔 Notification: payment.captured');

    const email = getCustomerEmail(order);
    if (!email) return;

    await emailService.send({
      to: email,
      subject: `Payment Confirmed — ${order.orderNumber}`,
      html: paymentSuccessTemplate(order, payment),
    });
  },

  onPaymentFailed: async (order: any, payment: any): Promise<void> => {
    logger.info({ orderId: order.id, paymentId: payment.id }, '🔔 Notification: payment.failed');

    const email = getCustomerEmail(order);
    if (!email) return;

    await emailService.send({
      to: email,
      subject: `Payment Failed — ${order.orderNumber}`,
      html: paymentFailedTemplate(order, payment.failureReason || undefined),
    });
  },

  onRefundInitiated: async (order: any, refundAmount: number): Promise<void> => {
    logger.info({ orderId: order.id, refundAmount }, '🔔 Notification: refund.initiated');

    const email = getCustomerEmail(order);
    if (!email) return;

    await emailService.send({
      to: email,
      subject: `Refund Initiated — ${order.orderNumber}`,
      html: refundInitiatedTemplate(order, refundAmount),
    });
  },

  // ───── Shipment events ─────────────────────────────────────────────────────

  onShipmentCreated: async (order: any, shipment: any): Promise<void> => {
    logger.info({ orderId: order.id, shipmentId: shipment.id }, '🔔 Notification: shipment.created');

    const email = getCustomerEmail(order);
    if (!email) return;

    await emailService.send({
      to: email,
      subject: `Your Order is Being Packed — ${order.orderNumber}`,
      html: shipmentCreatedTemplate(order, shipment),
    });
  },
};
