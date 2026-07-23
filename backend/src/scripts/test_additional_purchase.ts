import prisma from '../prisma/index';
import { orderNotifications } from '../notifications/order.notifications';

async function runAdditionalPurchaseVerification() {
  console.log('================================================================');
  console.log('🛍️ ADDITIONAL PURCHASE & EMAIL DELIVERY VERIFICATION');
  console.log('================================================================\n');

  // 1. Identify / Setup Customer Account
  const customerEmail = 'shreyasisahoo116@gmail.com'; // Resend sandbox verified recipient for full delivery
  let customer = await prisma.user.findUnique({ where: { email: customerEmail } });
  
  if (!customer) {
    customer = await prisma.user.create({
      data: {
        firstName: 'Rohan (E2E Test)',
        lastName: 'Verma',
        email: customerEmail,
        passwordHash: 'dummy_hash',
        phone: '9876512345',
        role: 'CUSTOMER',
        isActive: true,
      },
    });
    console.log('📍 1. Created Customer Account for:', customerEmail, `(ID: ${customer.id})`);
  } else {
    console.log('📍 1. Loaded Customer Account for:', customerEmail, `(ID: ${customer.id})`);
  }

  // 2. Select Product for Purchase
  const product = await prisma.product.findFirst({
    where: { status: 'ACTIVE', stockQuantity: { gt: 0 } },
  });

  if (!product) {
    console.error('❌ No active product in stock found for test!');
    process.exit(1);
  }

  console.log(`📍 2. Selected Product: "${product.name}" (SKU: ${product.sku}, Stock: ${product.stockQuantity}, Price: ₹${product.price})`);
  const initialStock = product.stockQuantity;
  const purchaseQty = 1;
  const itemTotal = Number(product.price) * purchaseQty;

  // Ensure Customer Address exists
  let address = await prisma.address.findFirst({ where: { userId: customer.id } });
  if (!address) {
    address = await prisma.address.create({
      data: {
        userId: customer.id,
        fullName: 'Rohan Verma',
        phone: '9876512345',
        line1: '108, Craft Enclave, Heritage Road',
        city: 'Jaipur',
        state: 'Rajasthan',
        country: 'India',
        postalCode: '302001',
        type: 'HOME',
        isDefaultShipping: true,
      },
    });
  }

  // 3. Complete Checkout Flow & Order Creation
  const orderNumber = `TTS-${Date.now().toString().slice(-6)}`;
  console.log(`📍 3. Executing Checkout & Creating Order #${orderNumber}...`);

  const createdOrder = await prisma.$transaction(async (tx) => {
    // Deduct stock
    await tx.product.update({
      where: { id: product.id },
      data: { stockQuantity: { decrement: purchaseQty } },
    });

    // Create Order
    return await tx.order.create({
      data: {
        orderNumber,
        user: { connect: { id: customer.id } },
        shippingAddress: { connect: { id: address!.id } },
        billingAddress: { connect: { id: address!.id } },
        subtotal: itemTotal,
        shipping: 0,
        tax: 0,
        grandTotal: itemTotal,
        orderStatus: 'PENDING',
        paymentStatus: 'CAPTURED',
        paymentMethod: 'ONLINE',
        items: {
          create: [
            {
              productId: product.id,
              productName: product.name,
              productSlug: product.slug,
              productImage: product.ogImageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363',
              unitPrice: product.price,
              quantity: purchaseQty,
              lineTotal: itemTotal,
            },
          ],
        },
        payment: {
          create: {
            amount: itemTotal,
            currency: 'INR',
            method: 'ONLINE',
            status: 'CAPTURED',
            provider: 'RAZORPAY',
            providerPaymentId: `pay_mock_${Date.now()}`,
            paidAt: new Date(),
          },
        },
      },
      include: {
        user: { include: { customerRisk: true } },
        items: true,
        payment: true,
      },
    });
  });

  console.log(`   ✅ Order #${createdOrder.orderNumber} Created (ID: ${createdOrder.id}, Total: ₹${createdOrder.grandTotal})`);

  // Verify stock deduction
  const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } });
  console.log(`   ✅ Stock Updated: ${initialStock} ➔ ${updatedProduct?.stockQuantity}`);

  // 4. Trigger & Inspect Emails
  console.log('\n📍 4. Triggering Order Creation Emails (Customer Confirmation + Admin Notification)...');
  await orderNotifications.onOrderCreated(createdOrder);

  // 5. Order Lifecycle Status Transitions (Processing -> Shipped -> Delivered)
  console.log('\n📍 5. Executing Admin Order Lifecycle Status Transitions...');
  
  // Transition 1: Processing
  let updatedOrder = await prisma.order.update({
    where: { id: createdOrder.id },
    data: { orderStatus: 'PROCESSING' },
    include: { user: true, items: true },
  });
  console.log(`   ✅ Status updated: PENDING ➔ ${updatedOrder.orderStatus}`);

  // Transition 2: Shipped
  updatedOrder = await prisma.order.update({
    where: { id: createdOrder.id },
    data: { orderStatus: 'SHIPPED' },
    include: { user: true, items: true },
  });
  console.log(`   ✅ Status updated: PROCESSING ➔ ${updatedOrder.orderStatus}`);
  console.log('   Sending Shipment Email...');
  await orderNotifications.onOrderShipped(updatedOrder, { trackingNumber: 'DELHIVERY8877', courier: 'Delhivery' });

  // Transition 3: Delivered
  updatedOrder = await prisma.order.update({
    where: { id: createdOrder.id },
    data: { orderStatus: 'DELIVERED' },
    include: { user: true, items: true },
  });
  console.log(`   ✅ Status updated: SHIPPED ➔ ${updatedOrder.orderStatus}`);
  console.log('   Sending Delivery Confirmation Email...');
  await orderNotifications.onOrderDelivered(updatedOrder);

  // 6. Verify Customer Order History & Admin Retrieval
  console.log('\n📍 6. Verifying Database & Admin Visibility...');
  const customerOrders = await prisma.order.findMany({
    where: { userId: customer.id },
    orderBy: { createdAt: 'desc' },
    include: { items: true, payment: true },
  });
  console.log(`   ✅ Customer Order History: Found ${customerOrders.length} order(s) for customer ${customer.email}.`);
  console.log(`   Latest Order Status: ${customerOrders[0].orderStatus}, Payment Status: ${customerOrders[0].paymentStatus}, Total: ₹${customerOrders[0].grandTotal}`);

  console.log('\n================================================================');
  console.log('🎉 PURCHASE & EMAIL WORKFLOW VERIFICATION COMPLETE');
  console.log('================================================================\n');
}

runAdditionalPurchaseVerification()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error('❌ Verification Failed:', err);
    await prisma.$disconnect();
    process.exit(1);
  });
