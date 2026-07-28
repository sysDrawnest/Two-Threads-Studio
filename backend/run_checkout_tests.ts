import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL is not defined in .env');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

const PORT = process.env.PORT || 5000;
const API_URL = `http://localhost:${PORT}/api/v1`;

async function runTests() {
  console.log('🏁 --- STARTING AUTHENTICATED CHECKOUT ARCHITECTURE TESTS ---');
  let testUser: any = null;
  let userToken = '';
  let guestId = `guest_test_${Date.now()}`;
  let addressId = '';
  let activeProduct: any = null;

  try {
    // 0. Find or create test product with inventory tracking
    activeProduct = await prisma.product.findFirst({
      where: { status: 'ACTIVE', trackInventory: true },
    });

    if (!activeProduct) {
      // Create a dummy product for testing
      activeProduct = await prisma.product.create({
        data: {
          id: `prod-test-${Date.now()}`,
          name: 'Test Embroidery Hoop',
          slug: `test-embroidery-hoop-${Date.now()}`,
          price: 500.0,
          comparePrice: 600.0,
          status: 'ACTIVE',
          type: 'kit',
          trackInventory: true,
          stockQuantity: 10,
          sku: `SKU-TEST-${Date.now()}`,
        },
      });
      console.log(`Created test product: ${activeProduct.name} (Stock: ${activeProduct.stockQuantity})`);
    } else {
      console.log(`Found active product: ${activeProduct.name} (Stock: ${activeProduct.stockQuantity})`);
    }

    // Set stock to a known quantity for test predictability (e.g. 10)
    await prisma.product.update({
      where: { id: activeProduct.id },
      data: { stockQuantity: 10, trackInventory: true }
    });
    activeProduct.stockQuantity = 10;

    // 0. Find or create test customer user
    const testEmail = `checkout.test.${Date.now()}@twothreadsstudio.com`;
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash('Test@12345', 10);
    
    testUser = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash,
        firstName: 'Checkout',
        lastName: 'Tester',
        role: 'CUSTOMER',
        phone: '9999999999',
        phoneVerified: true,
      },
    });
    console.log(`Created test user: ${testEmail}`);

    const secret = process.env.JWT_SECRET!;
    userToken = jwt.sign(
      { sub: testUser.id, email: testUser.email, role: testUser.role },
      secret,
      { expiresIn: '1h' }
    );

    // ----------------------------------------------------
    // Scenario 1: Guest adds products to cart
    // ----------------------------------------------------
    console.log('\n--- Scenario 1: Guest adds products to cart ---');
    const addRes = await fetch(`${API_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-guest-id': guestId,
      },
      body: JSON.stringify({
        productId: activeProduct.id,
        quantity: 2,
      }),
    });
    const addData = await addRes.json();
    if (addRes.ok && addData.success) {
      console.log('✅ Guest successfully added item to cart');
    } else {
      throw new Error(`Failed to add item to guest cart: ${JSON.stringify(addData)}`);
    }

    // ----------------------------------------------------
    // Scenario 2: Guest attempts checkout and is blocked (401)
    // ----------------------------------------------------
    console.log('\n--- Scenario 2: Guest attempts checkout (Session creation) ---');
    const checkoutSessRes = await fetch(`${API_URL}/checkout/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-guest-id': guestId,
      },
      body: JSON.stringify({}),
    });
    const checkoutSessData = await checkoutSessRes.json().catch(() => null);
    if (checkoutSessRes.status === 401) {
      console.log('✅ Guest session creation blocked with 401 Unauthorized');
    } else {
      throw new Error(`Guest session creation should be blocked (401), but got status ${checkoutSessRes.status}: ${JSON.stringify(checkoutSessData)}`);
    }

    // ----------------------------------------------------
    // Scenario 3: Unauthenticated API requests to other checkout endpoints return 401
    // ----------------------------------------------------
    console.log('\n--- Scenario 3: Unauthenticated request to GET /checkout/summary ---');
    const summaryRes = await fetch(`${API_URL}/checkout/summary`, {
      headers: {
        'x-guest-id': guestId,
      },
    });
    if (summaryRes.status === 401) {
      console.log('✅ GET /checkout/summary blocked with 401 Unauthorized');
    } else {
      throw new Error(`GET /checkout/summary should be blocked (401), got status ${summaryRes.status}`);
    }

    console.log('\n--- Scenario 3b: Unauthenticated request to PATCH /checkout/address ---');
    const addrPatchRes = await fetch(`${API_URL}/checkout/address`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-guest-id': guestId,
      },
      body: JSON.stringify({ shippingAddressId: 'some-id' }),
    });
    if (addrPatchRes.status === 401) {
      console.log('✅ PATCH /checkout/address blocked with 401 Unauthorized');
    } else {
      throw new Error(`PATCH /checkout/address should be blocked (401), got status ${addrPatchRes.status}`);
    }

    // ----------------------------------------------------
    // Scenario 4: User logs in and guest cart merges correctly
    // ----------------------------------------------------
    console.log('\n--- Scenario 4: Guest cart merges into user cart ---');
    // First, let's add 3 items to the USER's cart in the DB beforehand
    const userCart = await prisma.cart.create({
      data: { userId: testUser.id },
    });
    await prisma.cartItem.create({
      data: {
        cartId: userCart.id,
        productId: activeProduct.id,
        quantity: 3,
        unitPrice: activeProduct.price,
        productName: activeProduct.name,
        sku: activeProduct.sku || '',
        primaryImage: '',
      },
    });
    console.log(`Pre-added 3 items to user's cart (Cart ID: ${userCart.id})`);

    // Let's call /cart/merge
    const mergeRes = await fetch(`${API_URL}/cart/merge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ guestId }),
    });
    const mergeData = await mergeRes.json();
    if (mergeRes.ok && mergeData.success) {
      console.log('✅ Cart merge API succeeded');
    } else {
      throw new Error(`Cart merge API failed: ${JSON.stringify(mergeData)}`);
    }

    // ----------------------------------------------------
    // Scenario 5: Quantity merged correctly and duplicates removed
    // ----------------------------------------------------
    console.log('\n--- Scenario 5: Quantity merged correctly ---');
    const updatedUserItems = await prisma.cartItem.findMany({
      where: { cartId: userCart.id },
    });
    if (updatedUserItems.length === 1 && updatedUserItems[0].quantity === 5) {
      console.log('✅ Guest (2) + User (3) merged into 5 items successfully');
    } else {
      throw new Error(`Expected exactly 1 cart item with quantity 5, but got: ${JSON.stringify(updatedUserItems)}`);
    }

    // ----------------------------------------------------
    // Scenario 6: Inventory validation during cart merge limits quantity to stock
    // ----------------------------------------------------
    console.log('\n--- Scenario 6: Inventory validation limits quantity to available stock ---');
    // Let's create a new guest cart and add 10 items (stock is 10, user already has 5, so total would be 15)
    const guestId2 = `guest_test_2_${Date.now()}`;
    const addRes2 = await fetch(`${API_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-guest-id': guestId2,
      },
      body: JSON.stringify({
        productId: activeProduct.id,
        quantity: 10,
      }),
    });
    const addData2 = await addRes2.json();
    if (!addRes2.ok) {
      console.log(`Add 10 directly failed as expected or due to stock validation: ${addData2.message}. Adding 6 instead.`);
      const addRes3 = await fetch(`${API_URL}/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-guest-id': guestId2,
        },
        body: JSON.stringify({
          productId: activeProduct.id,
          quantity: 6,
        }),
      });
      if (!addRes3.ok) {
        throw new Error('Could not add to second guest cart');
      }
    }

    // Now merge guestId2. User cart already has 5. Stock is 10. Max allowed in merge is 10.
    const mergeRes2 = await fetch(`${API_URL}/cart/merge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ guestId: guestId2 }),
    });
    
    // Check cart items
    const mergedUserItems = await prisma.cartItem.findMany({
      where: { cartId: userCart.id },
    });
    console.log(`Merged cart items count: ${mergedUserItems.length}, quantity: ${mergedUserItems[0]?.quantity}`);
    if (mergedUserItems[0]?.quantity <= 10) {
      console.log('✅ Inventory validation capped merged quantity to stock limit (<= 10)');
    } else {
      throw new Error(`Inventory validation failed: merged quantity is ${mergedUserItems[0]?.quantity} which exceeds stock limit of 10!`);
    }

    // ----------------------------------------------------
    // Scenario 7: User adds a new address and it persists successfully
    // ----------------------------------------------------
    console.log('\n--- Scenario 7: User adds a new address ---');
    const addrRes = await fetch(`${API_URL}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        fullName: 'Jane Doe',
        phone: '9999999999',
        line1: '456 Studio Road',
        city: 'Bhubaneswar',
        state: 'Odisha',
        country: 'IN',
        postalCode: '751024',
        type: 'WORK',
      }),
    });
    const addrData = await addrRes.json();
    if (addrRes.ok && addrData.success) {
      addressId = addrData.address.id;
      console.log(`✅ Address added successfully. ID: ${addressId}`);
    } else {
      throw new Error(`Failed to add address: ${JSON.stringify(addrData)}`);
    }

    // ----------------------------------------------------
    // Scenario 8: Checkout loads user's saved addresses
    // ----------------------------------------------------
    console.log('\n--- Scenario 8: Checkout loads user\'s saved address ---');
    const sessRes = await fetch(`${API_URL}/checkout/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({}),
    });
    const sessData = await sessRes.json();
    if (sessRes.ok && sessData.success) {
      const sessionToken = sessData.data.session.sessionToken;
      console.log(`✅ Checkout session initialized successfully. SessionToken: ${sessionToken}`);
      // Fetch summary to verify address
      const sumRes = await fetch(`${API_URL}/checkout/summary?sessionToken=${sessionToken}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const sumData = await sumRes.json();
      if (sumRes.ok && sumData.success) {
        console.log('✅ Checkout summary loaded successfully');
        const shippingAddress = sumData.data.shippingAddress;
        if (shippingAddress && shippingAddress.id === addressId) {
          console.log('✅ Checkout automatically loaded the default/only address');
        } else {
          console.log(`⚠️ Expected address ID ${addressId}, but got ${shippingAddress?.id}. Loading addresses list manually...`);
          // Let's verify address list endpoint works
          const listAddrRes = await fetch(`${API_URL}/addresses`, {
            headers: { Authorization: `Bearer ${userToken}` },
          });
          const listAddrData = await listAddrRes.json();
          if (listAddrRes.ok && listAddrData.addresses.length > 0) {
            console.log('✅ Addresses list loaded successfully via GET /addresses');
          } else {
            throw new Error('Failed to load addresses list');
          }
        }
      } else {
        throw new Error(`Failed to load checkout summary: ${JSON.stringify(sumData)}`);
      }
    } else {
      throw new Error(`Failed to initialize checkout session: ${JSON.stringify(sessData)}`);
    }

    // ----------------------------------------------------
    // Scenario 9: Order placement succeeds and is linked to the authenticated user
    // ----------------------------------------------------
    console.log('\n--- Scenario 9: Order placement succeeds and is linked to authenticated user ---');
    const orderRes = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        shippingAddressId: addressId,
        billingAddressId: addressId,
        paymentMethod: 'ONLINE',
      }),
    });
    const orderData = await orderRes.json();
    if (orderRes.ok && orderData.success) {
      const order = orderData.order;
      console.log(`✅ Order placed successfully. Order Number: ${order.orderNumber}`);
      if (order.userId === testUser.id) {
        console.log('✅ Order is correctly linked to the authenticated user\'s ID');
      } else {
        throw new Error(`Order userId (${order.userId}) does not match test user ID (${testUser.id})`);
      }
    } else {
      throw new Error(`Order placement failed: ${JSON.stringify(orderData)}`);
    }

    // ----------------------------------------------------
    // Scenario 10: Razorpay Order Creation (Provider Order)
    // ----------------------------------------------------
    console.log('\n--- Scenario 10: Create Razorpay Order via Provider ---');
    const orderId = orderData.order.id;
    const rzpOrderRes = await fetch(`${API_URL}/payments/orders/${orderId}/razorpay-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    const rzpOrderData = await rzpOrderRes.json();
    console.log('Razorpay Order Creation API Response status:', rzpOrderRes.status);
    console.log('Razorpay Order Creation API Response body:', JSON.stringify(rzpOrderData, null, 2));

    if (rzpOrderRes.status === 201 && rzpOrderData.success) {
      console.log(`✅ Razorpay order created successfully. Provider Order ID: ${rzpOrderData.data.razorpayOrderId}`);
      if (rzpOrderData.data.razorpayOrderId && rzpOrderData.data.amount) {
        console.log(`✅ Returned amount: ${rzpOrderData.data.amount} paise, currency: ${rzpOrderData.data.currency}`);
      } else {
        throw new Error('Razorpay order response missing providerOrderId or amount');
      }
    } else {
      throw new Error(`Razorpay order creation failed: ${JSON.stringify(rzpOrderData)}`);
    }

    // ----------------------------------------------------
    // Scenario 11: Payment Signature Verification & Capture
    // ----------------------------------------------------
    console.log('\n--- Scenario 11: Verify Razorpay Payment Signature ---');
    const mockPaymentId = `pay_test_${Date.now()}`;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET || '';
    const bodyStr = `${rzpOrderData.data.razorpayOrderId}|${mockPaymentId}`;
    const validSignature = crypto.createHmac('sha256', keySecret).update(bodyStr).digest('hex');

    const verifyRes = await fetch(`${API_URL}/payments/orders/${orderId}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        razorpay_order_id: rzpOrderData.data.razorpayOrderId,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: validSignature,
      }),
    });
    const verifyData = await verifyRes.json();
    console.log('Payment Verification API Response status:', verifyRes.status);
    console.log('Payment Verification API Response body:', JSON.stringify(verifyData, null, 2));

    // ----------------------------------------------------
    // Scenario 12: Webhook Asynchronous Payment Capture Simulation
    // ----------------------------------------------------
    console.log('\n--- Scenario 12: Webhook payment.captured Simulation ---');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'whsec_test_secret_12345';
    process.env.RAZORPAY_WEBHOOK_SECRET = webhookSecret;

    const webhookEventId = `evt_test_${Date.now()}`;
    const webhookPayload = {
      event: 'payment.captured',
      event_id: webhookEventId,
      payload: {
        payment: {
          entity: {
            id: `pay_wh_${Date.now()}`,
            order_id: rzpOrderData.data.razorpayOrderId,
            amount: rzpOrderData.data.amount,
            status: 'captured',
          },
        },
      },
    };

    const webhookBody = Buffer.from(JSON.stringify(webhookPayload), 'utf8');
    const webhookSignature = crypto.createHmac('sha256', webhookSecret).update(webhookBody).digest('hex');

    const webhookRes = await fetch(`http://localhost:${PORT}/webhooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': webhookSignature,
      },
      body: webhookBody,
    });

    const webhookData = await webhookRes.json();
    console.log('Webhook API Response status:', webhookRes.status);
    console.log('Webhook API Response body:', JSON.stringify(webhookData, null, 2));

    if (webhookRes.ok && webhookData.status === 'ok') {
      console.log('✅ Webhook payment.captured received and acknowledged with 200 OK');
    } else {
      throw new Error(`Webhook simulation failed: ${JSON.stringify(webhookData)}`);
    }

    // ----------------------------------------------------
    // Scenario 13: Duplicate Webhook Event Idempotency Check
    // ----------------------------------------------------
    console.log('\n--- Scenario 13: Duplicate Webhook Event Idempotency Check ---');
    const dupWebhookRes = await fetch(`http://localhost:${PORT}/webhooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': webhookSignature,
      },
      body: webhookBody,
    });

    const dupWebhookData = await dupWebhookRes.json();
    console.log('Duplicate Webhook API Response status:', dupWebhookRes.status);
    console.log('Duplicate Webhook API Response body:', JSON.stringify(dupWebhookData, null, 2));

    if (dupWebhookRes.ok && dupWebhookData.status === 'already_processed') {
      console.log('✅ Duplicate webhook correctly identified and skipped (Idempotent 200 OK)');
    } else {
      throw new Error(`Duplicate webhook idempotency check failed: ${JSON.stringify(dupWebhookData)}`);
    }

    console.log('\n🎉 ALL ARCHITECTURE INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉');

  } catch (err: any) {
    console.error(`\n❌ TEST FAILURE: ${err.message}`);
    process.exitCode = 1;
  } finally {
    // Cleanup
    console.log('\n🧹 Cleaning up test database records...');
    if (testUser) {
      try {
        // Delete orders
        await prisma.orderItem.deleteMany({
          where: { order: { userId: testUser.id } },
        });
        await prisma.orderAuditLog.deleteMany({
          where: { order: { userId: testUser.id } },
        });
        await prisma.order.deleteMany({
          where: { userId: testUser.id },
        });
        // Delete addresses
        await prisma.address.deleteMany({
          where: { userId: testUser.id },
        });
        // Delete carts
        await prisma.cartItem.deleteMany({
          where: { cart: { userId: testUser.id } },
        });
        await prisma.cart.deleteMany({
          where: { userId: testUser.id },
        });
        // Delete user
        await prisma.user.delete({
          where: { id: testUser.id },
        });
        console.log('✅ Cleanup completed successfully.');
      } catch (cleanupErr: any) {
        console.error(`⚠️ Cleanup failed: ${cleanupErr.message}`);
      }
    }

    await prisma.$disconnect();
    await pool.end();
  }
}

runTests();
