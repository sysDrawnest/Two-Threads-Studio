import prisma from '../prisma';
import { paymentService } from '../services/payment.service';
import { paymentProvider } from '../providers/payment';
import { PaymentStatus, OrderStatus, RefundStatus } from '@prisma/client';
import logger from '../lib/logger';
import crypto from 'crypto';

async function testGatewayRefundIntegration() {
  logger.info('--- STARTING GATEWAY REFUND INTEGRATION TEST ---');

  const user = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
  if (!user) throw new Error('No customer found in DB for testing');

  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) throw new Error('No admin found in DB for testing');

  logger.info('1. Creating mock order');
  const order = await prisma.order.create({
    data: {
      user: { connect: { id: user.id } },
      orderNumber: `INT-TEST-${Date.now().toString(36).toUpperCase()}`,
      subtotal: 1000.00,
      shipping: 50.00,
      tax: 180.00,
      grandTotal: 1230.00,
      orderStatus: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      shippingAddress: {
        create: {
          fullName: 'Test User',
          line1: '123 Test Street',
          city: 'Testville',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India',
          phone: '9876543210',
          user: { connect: { id: user.id } },
        }
      },
      billingAddress: {
        create: {
          fullName: 'Test User',
          line1: '123 Test Street',
          city: 'Testville',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India',
          phone: '9876543210',
          user: { connect: { id: user.id } },
        }
      }
    }
  });

  logger.info('2. Creating Razorpay Payment via Service');
  const razorpayOrder = await paymentService.createRazorpayOrder(order.id, user.id);
  
  if (!razorpayOrder.razorpayOrderId) {
    throw new Error('Failed to create Razorpay Order');
  }
  
  logger.info(`Razorpay Order created: ${razorpayOrder.razorpayOrderId}`);

  logger.info('3. Simulating Payment Capture with valid signature');
  const mockRazorpayPaymentId = `pay_test_${Date.now().toString(36)}`;
  
  // Generate a valid signature for our test
  const secret = process.env.RAZORPAY_SECRET || 'test_secret';
  const expectedSignature = crypto.createHmac('sha256', secret)
    .update(razorpayOrder.razorpayOrderId + '|' + mockRazorpayPaymentId)
    .digest('hex');

  const captureResult = await paymentService.verifyPayment(
    order.id,
    user.id,
    razorpayOrder.razorpayOrderId,
    mockRazorpayPaymentId,
    expectedSignature
  );

  if (captureResult.payment.status !== PaymentStatus.CAPTURED) {
    throw new Error('Payment was not marked as CAPTURED');
  }
  if (captureResult.payment.method !== 'ONLINE') {
    throw new Error('Payment method was not persisted as ONLINE');
  }

  logger.info(`Payment Captured successfully: ${captureResult.payment.providerPaymentId}`);

  logger.info('4. Stubbing paymentProvider.processRefund to simulate Razorpay API response');
  // We stub the gateway call to avoid calling Razorpay with our mock payment ID
  const originalProcessRefund = paymentProvider.processRefund;
  const mockRefundId = `rfnd_test_${Date.now().toString(36)}`;
  
  let gatewayCalled = false;
  paymentProvider.processRefund = async (params: any) => {
    gatewayCalled = true;
    logger.info(`Mock Gateway processRefund called with: ${JSON.stringify(params)}`);
    return {
      refundId: mockRefundId,
      status: 'processed' as any,
      amount: params.amount,
      raw: { id: mockRefundId, status: 'processed', amount: params.amount }
    } as any;
  };

  logger.info('5. Triggering Refund via Service');
  try {
    const refundResult = await paymentService.processRefund(
      captureResult.payment.id,
      admin.id,
      1230.00,
      'Integration test refund'
    );

    logger.info('6. Verifying Results');
    if (!gatewayCalled) {
      throw new Error('FAILED: Razorpay Gateway API was NOT called for refund!');
    }

    if (refundResult.refund.providerRefundId !== mockRefundId) {
      throw new Error('FAILED: Refund record did not store the returned rfnd_xxx ID');
    }

    if (!refundResult.payment || refundResult.payment.status !== PaymentStatus.REFUNDED) {
      throw new Error(`FAILED: Payment status is ${refundResult.payment?.status}, expected REFUNDED`);
    }

    logger.info(`SUCCESS: Refund created with ID: ${refundResult.refund.id} and Gateway ID: ${mockRefundId}`);
    logger.info(`SUCCESS: Payment Status -> ${refundResult.payment?.status}`);
  } finally {
    // Restore original method
    paymentProvider.processRefund = originalProcessRefund;
    
    // Cleanup
    logger.info('7. Cleaning up test data');
    await prisma.refundTimeline.deleteMany({ where: { refund: { orderId: order.id } } });
    await prisma.refund.deleteMany({ where: { orderId: order.id } });
    await prisma.orderStatusHistory.deleteMany({ where: { orderId: order.id } });
    await prisma.orderAuditLog.deleteMany({ where: { orderId: order.id } });
    await prisma.payment.deleteMany({ where: { orderId: order.id } });
    await prisma.order.deleteMany({ where: { id: order.id } });
  }

  logger.info('--- INTEGRATION TEST PASSED COMPLETELY ---');
}

testGatewayRefundIntegration().catch(err => {
  logger.error(err, 'Integration Test Failed');
  process.exit(1);
});
