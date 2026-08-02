import prisma from '../prisma';

async function inspectRefunds() {
  console.log('=== INSPECTING PAYMENTS ===');
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
  console.table(payments.map(p => ({
    id: p.id,
    orderId: p.orderId,
    method: p.method,
    amount: Number(p.amount),
    status: p.status,
    providerPaymentId: p.providerPaymentId,
    createdAt: p.createdAt,
  })));

  console.log('=== INSPECTING REFUNDS ===');
  const refunds = await prisma.refund.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      timeline: true,
    }
  });
  console.log(JSON.stringify(refunds, null, 2));
}

inspectRefunds().catch(console.error);
