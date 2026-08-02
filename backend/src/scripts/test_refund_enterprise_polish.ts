import prisma from '../prisma';
import { paymentService } from '../services/payment.service';
import { reconciliationService } from '../services/reconciliation.service';
import { analyticsController } from '../controllers/analytics.controller';
import { RefundStatus, PaymentStatus, OrderStatus, ReturnStatus, AuditAction } from '@prisma/client';
import logger from '../lib/logger';

async function testEnterpriseRefundPolish() {
  logger.info('--- STARTING ENTERPRISE REFUND POLISH VERIFICATION ---');

  // 1. Create a dummy order, payment, and return request
  logger.info('1. Creating mock order, payment, and refund records');
  const user = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
  if (!user) {
    logger.error('No customer user found in DB');
    return;
  }

  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) {
    logger.error('No admin user found in DB');
    return;
  }

  const order = await prisma.order.create({
    data: {
      user: { connect: { id: user.id } },
      orderNumber: `ORD-TEST-${Date.now().toString(36).toUpperCase()}`,
      subtotal: 1000.00,
      shipping: 50.00,
      tax: 180.00,
      grandTotal: 1230.00,
      orderStatus: OrderStatus.DELIVERED,
      paymentStatus: PaymentStatus.CAPTURED,
      shippingAddress: {
        create: {
          fullName: 'Test User',
          line1: '123 Studio Road',
          city: 'Bangalore',
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
          line1: '123 Studio Road',
          city: 'Bangalore',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India',
          phone: '9876543210',
          user: { connect: { id: user.id } },
        }
      }
    },
  });

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: 1230.00,
      method: 'ONLINE',
      status: PaymentStatus.CAPTURED,
      provider: 'RAZORPAY',
      providerPaymentId: `pay_test_${Date.now().toString(36)}`,
    },
  });

  const returnRequest = await prisma.returnRequest.create({
    data: {
      orderId: order.id,
      userId: user.id,
      reason: 'SIZE_ISSUE',
      status: ReturnStatus.REQUESTED,
      refundType: 'ORIGINAL_PAYMENT',
    },
  });

  // 2. Initiate a refund
  logger.info('2. Manually creating INITIATED refund to test status transitions');
  const refund = await prisma.refund.create({
    data: {
      paymentId: payment.id,
      returnRequestId: returnRequest.id,
      orderId: order.id,
      provider: 'RAZORPAY',
      providerRefundId: `rfnd_test_${Date.now().toString(36)}`,
      status: RefundStatus.INITIATED,
      amount: 1230.00,
      reason: 'Defective item replacement',
      idempotencyKey: `idemp_rfnd_${returnRequest.id}`,
      initiatedAt: new Date(),
    }
  });

  await paymentService.createTimelineEvent({
    refundId: refund.id,
    status: RefundStatus.INITIATED,
    title: 'Refund Initiated',
    description: 'Refund of ₹1230.00 submitted to Razorpay gateway.',
    source: 'SYSTEM',
    metadata: { refundId: refund.id, amount: 1230.00 },
  });

  logger.info(`Refund created with status: ${refund.status}, ID: ${refund.id}`);

  // Fetch timeline to verify first event
  const timeline = await prisma.refundTimeline.findMany({
    where: { refundId: refund.id },
  });
  logger.info(`Timeline created count: ${timeline.length}`);
  logger.info(`Timeline title: ${timeline[0]?.title}, source: ${timeline[0]?.source}`);

  if (timeline[0]?.title !== 'Refund Initiated') {
    throw new Error('Expected first timeline title to be "Refund Initiated"');
  }

  // 3. Test Scheduled Reconciliation and Lock acquisition
  logger.info('3. Testing scheduled reconciliation service and CronJobLock');
  
  // Make refund older than 2 hours so it matches stuck query
  await prisma.refund.update({
    where: { id: refund.id },
    data: { initiatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
  });

  // Run reconciliation
  const syncResult = await reconciliationService.runReconciliation('test_worker_1');
  logger.info(`Reconciliation run result: ${JSON.stringify(syncResult)}`);

  // Try executing concurrently to verify lock rejection
  const lockId = 'refund_reconciliation';
  await prisma.cronJobLock.upsert({
    where: { id: lockId },
    update: { expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    create: { id: lockId, lockedBy: 'other_worker', expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
  });

  const doubleLockRun = await reconciliationService.runReconciliation('test_worker_2');
  logger.info(`Concurrent run expected skip result: ${JSON.stringify(doubleLockRun)}`);

  if (doubleLockRun.status !== 'skipped') {
    throw new Error('Expected concurrent job execution to be skipped due to lock');
  }

  // Clean lock table
  await prisma.cronJobLock.delete({ where: { id: lockId } }).catch(() => {});

  // 4. Test Manual Override Settle
  logger.info('4. Testing admin manual override');
  const overridden = await paymentService.manualOverrideRefund(
    refund.id,
    admin.id,
    'Manually transferred via IMPS UTR 42398402'
  );

  logger.info(`Overridden status: ${overridden?.status}`);
  logger.info(`manualOverride flag: ${overridden?.manualOverride}`);
  logger.info(`overrideReason: ${overridden?.overrideReason}`);

  if (!overridden?.manualOverride || overridden?.status !== RefundStatus.PROCESSED) {
    throw new Error('Manual override failed to apply');
  }

  // Fetch updated timeline
  const updatedTimeline = await prisma.refundTimeline.findMany({
    where: { refundId: refund.id },
    orderBy: { createdAt: 'asc' },
  });
  logger.info(`Updated timeline steps count: ${updatedTimeline.length}`);
  logger.info(`Latest timeline step: ${updatedTimeline[updatedTimeline.length - 1]?.title}`);

  if (updatedTimeline[updatedTimeline.length - 1]?.title !== 'Manual Override Applied') {
    throw new Error('Expected latest timeline entry to be "Manual Override Applied"');
  }

  // Check audit log
  const auditLogs = await prisma.orderAuditLog.findMany({
    where: { orderId: order.id, action: AuditAction.REFUND_OVERRIDDEN },
  });
  logger.info(`Audit log records count: ${auditLogs.length}`);

  if (auditLogs.length !== 1) {
    throw new Error('Expected audit log to record REFUND_OVERRIDDEN action');
  }

  // 5. Test Analytics Cache
  logger.info('5. Testing analytics controller mapping and caching');
  
  // Wrap req/res stubs
  let responseData: any = null;
  const mockReq = {} as any;
  const mockRes = {
    status: (code: number) => ({
      json: (data: any) => { responseData = data; }
    }),
  } as any;
  const mockNext = (err: any) => { if (err) throw err; };

  await analyticsController.getRefundAnalytics(mockReq, mockRes, mockNext);
  logger.info(`Analytics fetch volume: ${responseData?.data?.summary?.totalRefundedVolume}`);
  logger.info(`Analytics rates: ${JSON.stringify(responseData?.data?.rates)}`);
  logger.info(`Analytics status distribution: ${JSON.stringify(responseData?.data?.statuses)}`);

  // Fetch again to check cache hit
  await analyticsController.getRefundAnalytics(mockReq, mockRes, mockNext);
  logger.info(`Second hit fromCache flag: ${responseData?.data?.fromCache}`);

  if (!responseData?.data?.fromCache) {
    throw new Error('Expected second hit to be served from memory cache');
  }

  // 6. Cleanup mock records
  logger.info('6. Cleaning up mock records');
  await prisma.refundTimeline.deleteMany({ where: { refundId: refund.id } });
  await prisma.refund.deleteMany({ where: { id: refund.id } });
  await prisma.returnRequest.deleteMany({ where: { id: returnRequest.id } });
  await prisma.payment.deleteMany({ where: { id: payment.id } });
  await prisma.orderAuditLog.deleteMany({ where: { orderId: order.id } });
  await prisma.order.deleteMany({ where: { id: order.id } });

  logger.info('--- ALL ENTERPRISE REFUND POLISH VERIFICATIONS PASSED ---');
}

testEnterpriseRefundPolish().catch((err) => {
  logger.error(err, 'Verification script failed');
  process.exit(1);
});
