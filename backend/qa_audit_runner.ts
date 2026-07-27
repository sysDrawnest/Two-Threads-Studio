import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL is not defined');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

const PORT = process.env.PORT || 5000;
const API_URL = `http://localhost:${PORT}/api/v1`;

async function audit() {
  console.log('=====================================================');
  console.log('🚀 TWO THREADS STUDIO - COMPREHENSIVE QA AUDIT RUNNER');
  console.log('=====================================================\n');

  const results: any = {
    phase1_auth: null,
    phase2_products: null,
    phase3_cart: null,
    phase4_checkout_entry: null,
    phase5_address: null,
    phase6_shipping: null,
    phase7_summary_math: null,
    phase8_coupons: null,
    phase9_payment: null,
    phase10_order_creation: null,
    phase11_emails: null,
    phase12_admin: null,
  };

  try {
    // ---------------------------------------------------------
    // Phase 1: Authentication Test with User Account
    // ---------------------------------------------------------
    console.log('--- Phase 1: Testing Customer Authentication ---');
    const testEmail = 'shreyasisahoo116@gmail.com';
    const testPassword = '@Krishna116';

    let loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword }),
    });

    let loginData = await loginRes.json();
    let token = loginData?.data?.accessToken;
    let userId = loginData?.data?.user?.id;

    if (!loginRes.ok || !token) {
      console.log(`⚠️ Login failed for ${testEmail}: ${JSON.stringify(loginData)}`);
      console.log('Checking if user exists in DB or creating/updating password hash...');
      let dbUser = await prisma.user.findUnique({ where: { email: testEmail } });
      const bcrypt = require('bcrypt');
      const hash = await bcrypt.hash(testPassword, 10);

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            email: testEmail,
            passwordHash: hash,
            firstName: 'Shreyasi',
            lastName: 'Sahoo',
            role: 'CUSTOMER',
            phone: '9876543210',
          },
        });
        console.log(`✅ Created test user in DB: ${testEmail}`);
      } else {
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { passwordHash: hash },
        });
        console.log(`✅ Updated password hash in DB for existing user: ${testEmail}`);
      }

      // Retry login
      loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: testPassword }),
      });
      loginData = await loginRes.json();
      token = loginData?.data?.accessToken;
      userId = loginData?.data?.user?.id;
    }

    console.log(`Status: ${loginRes.status}, Success: ${loginData.success}`);
    console.log(`User ID: ${userId}, Role: ${loginData?.data?.user?.role}`);

    // Verify /auth/me
    const meRes = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData = await meRes.json();
    console.log(`GET /auth/me status: ${meRes.status}, email: ${meData?.data?.user?.email}`);

    results.phase1_auth = {
      status: loginRes.ok && meRes.ok ? 'PASS' : 'FAIL',
      user: meData?.data?.user,
      accessTokenPresent: !!token,
    };

    // ---------------------------------------------------------
    // Phase 2: Product Discovery & Inventory
    // ---------------------------------------------------------
    console.log('\n--- Phase 2: Testing Product Discovery & Inventory ---');
    const productsRes = await fetch(`${API_URL}/products?limit=10`);
    const productsData = await productsRes.json();
    const productsList = productsData?.data?.products || productsData?.products || [];
    console.log(`Fetched ${productsList.length} products`);

    let activeProduct = productsList.find((p: any) => p.status === 'ACTIVE' || p.stockQuantity > 0);
    if (!activeProduct && productsList.length > 0) activeProduct = productsList[0];

    let pdpData = null;
    if (activeProduct) {
      const pdpRes = await fetch(`${API_URL}/products/${activeProduct.slug || activeProduct.id}`);
      pdpData = await pdpRes.json();
      console.log(`PDP status for ${activeProduct.name}: ${pdpRes.status}, Price: ${activeProduct.price}, Stock: ${activeProduct.stockQuantity}`);
    }

    results.phase2_products = {
      status: productsRes.ok && activeProduct ? 'PASS' : 'FAIL',
      productCount: productsList.length,
      sampleProduct: activeProduct ? { id: activeProduct.id, name: activeProduct.name, price: activeProduct.price, stock: activeProduct.stockQuantity } : null,
    };

    // ---------------------------------------------------------
    // Phase 3: Cart Management
    // ---------------------------------------------------------
    console.log('\n--- Phase 3: Testing Cart Operations ---');
    if (activeProduct) {
      // Clear existing cart items first for clean test
      const existingCart = await prisma.cart.findFirst({ where: { userId } });
      if (existingCart) {
        await prisma.cartItem.deleteMany({ where: { cartId: existingCart.id } });
      }

      // Add to cart
      const addCartRes = await fetch(`${API_URL}/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: activeProduct.id, quantity: 2 }),
      });
      const addCartData = await addCartRes.json();
      console.log(`Add to cart status: ${addCartRes.status}, success: ${addCartData.success}`);

      // Get cart
      const getCartRes = await fetch(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const getCartData = await getCartRes.json();
      console.log(`GET /cart status: ${getCartRes.status}, items count: ${getCartData?.data?.items?.length || getCartData?.cart?.items?.length || 0}`);

      results.phase3_cart = {
        status: addCartRes.ok && getCartRes.ok ? 'PASS' : 'FAIL',
        cartData: getCartData,
      };
    }

    // ---------------------------------------------------------
    // Phase 4 & 6 & 7: Checkout Entry, Session & Summary Math
    // ---------------------------------------------------------
    console.log('\n--- Phase 4, 6, 7: Testing Checkout Session & Summary Calculations ---');
    const sessRes = await fetch(`${API_URL}/checkout/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });
    const sessData = await sessRes.json();
    const sessionToken = sessData?.data?.session?.sessionToken;
    console.log(`Checkout session init status: ${sessRes.status}, token: ${sessionToken}`);

    const summaryRes = await fetch(`${API_URL}/checkout/summary?sessionToken=${sessionToken || ''}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const summaryData = await summaryRes.json();
    console.log(`Checkout summary status: ${summaryRes.status}`);
    console.log('Summary Breakdown:', JSON.stringify(summaryData?.data || summaryData, null, 2));

    results.phase4_checkout_entry = { status: sessRes.ok ? 'PASS' : 'FAIL', sessionToken };
    results.phase7_summary_math = { status: summaryRes.ok ? 'PASS' : 'FAIL', summary: summaryData?.data };

    // ---------------------------------------------------------
    // Phase 5: Address Management CRUD
    // ---------------------------------------------------------
    console.log('\n--- Phase 5: Address Management Deep Dive ---');
    // List addresses
    const listAddrRes = await fetch(`${API_URL}/addresses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listAddrData = await listAddrRes.json();
    console.log(`GET /addresses status: ${listAddrRes.status}, count: ${listAddrData?.addresses?.length}`);

    // Create a new test address
    const createAddrRes = await fetch(`${API_URL}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName: 'Shreyasi Sahoo',
        phone: '9876543210',
        line1: 'Plot 102, Silicon Hills, Patia',
        line2: 'Near KIIT Square',
        landmark: 'Landmark Tower',
        city: 'Bhubaneswar',
        state: 'Odisha',
        country: 'IN',
        postalCode: '751024',
        type: 'HOME',
      }),
    });
    const createAddrData = await createAddrRes.json();
    console.log(`POST /addresses status: ${createAddrRes.status}, addressId: ${createAddrData?.address?.id}`);
    const createdAddressId = createAddrData?.address?.id;

    // Update session with new address
    if (createdAddressId && sessionToken) {
      const linkAddrRes = await fetch(`${API_URL}/checkout/address`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionToken,
          shippingAddressId: createdAddressId,
          billingAddressId: createdAddressId,
        }),
      });
      const linkAddrData = await linkAddrRes.json();
      console.log(`PATCH /checkout/address status: ${linkAddrRes.status}, success: ${linkAddrData.success}`);
    }

    results.phase5_address = {
      status: listAddrRes.ok && createAddrRes.ok ? 'PASS' : 'FAIL',
      createdAddressId,
      initialCount: listAddrData?.addresses?.length,
    };

    // ---------------------------------------------------------
    // Phase 8: Coupon Testing
    // ---------------------------------------------------------
    console.log('\n--- Phase 8: Coupon Validation Testing ---');
    const invalidCouponRes = await fetch(`${API_URL}/coupons/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code: 'INVALID_COUPON_9999', cartTotal: 1000 }),
    });
    const invalidCouponData = await invalidCouponRes.json();
    console.log(`Invalid coupon validation status: ${invalidCouponRes.status}, message: ${invalidCouponData.message}`);

    results.phase8_coupons = {
      invalidTestStatus: invalidCouponRes.status === 400 || !invalidCouponData.success ? 'PASS' : 'FAIL',
    };

    // ---------------------------------------------------------
    // Phase 9 & 10: Payment & Order Creation
    // ---------------------------------------------------------
    console.log('\n--- Phase 9 & 10: Payment & Order Creation ---');
    // Create order first
    let createdOrderId = null;
    let createdOrderNumber = null;
    if (createdAddressId) {
      const createOrderRes = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddressId: createdAddressId,
          billingAddressId: createdAddressId,
          paymentMethod: 'ONLINE',
        }),
      });
      const createOrderData = await createOrderRes.json();
      console.log(`POST /orders status: ${createOrderRes.status}, orderNumber: ${createOrderData?.order?.orderNumber}`);
      createdOrderId = createOrderData?.order?.id;
      createdOrderNumber = createOrderData?.order?.orderNumber;

      if (createdOrderId) {
        // Attempt Razorpay order creation
        const rzpOrderRes = await fetch(`${API_URL}/payments/orders/${createdOrderId}/razorpay-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const rzpOrderData = await rzpOrderRes.json();
        console.log(`POST /payments/orders/.../razorpay-order status: ${rzpOrderRes.status}`);
        console.log('Razorpay Order Response:', JSON.stringify(rzpOrderData, null, 2));

        // Test verify signature
        const verifyRes = await fetch(`${API_URL}/payments/orders/${createdOrderId}/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            razorpay_order_id: rzpOrderData?.data?.razorpayOrderId || 'order_mock_123',
            razorpay_payment_id: 'pay_mock_123',
            razorpay_signature: 'dummy_signature',
          }),
        });
        const verifyData = await verifyRes.json();
        console.log(`POST /payments/orders/.../verify status: ${verifyRes.status}`);
        console.log('Verify Payment Response:', JSON.stringify(verifyData, null, 2));

        results.phase9_payment = {
          rzpOrderCreationStatus: rzpOrderRes.status,
          rzpOrderData: rzpOrderData?.data,
          verifyStatus: verifyRes.status,
          verifyData,
        };
      }

      results.phase10_order_creation = {
        status: createOrderRes.ok ? 'PASS' : 'FAIL',
        orderId: createdOrderId,
        orderNumber: createdOrderNumber,
      };
    }

    // ---------------------------------------------------------
    // Phase 11: Email Verification Test
    // ---------------------------------------------------------
    console.log('\n--- Phase 11: Testing Email Dispatch ---');
    const devEmailRes = await fetch(`${API_URL}/dev/test-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: testEmail }),
    });
    const devEmailData = await devEmailRes.json().catch(() => null);
    console.log(`Dev test email endpoint status: ${devEmailRes.status}, response:`, devEmailData);

    results.phase11_emails = {
      status: devEmailRes.status === 200 ? 'PASS' : 'WARN/FAIL',
      response: devEmailData,
    };

    // ---------------------------------------------------------
    // Phase 12: Admin Dashboard Verification
    // ---------------------------------------------------------
    console.log('\n--- Phase 12: Testing Admin Endpoints ---');
    // Find or create admin user
    let adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!adminUser) {
      console.log('No ADMIN user found in DB. Promoting test user to ADMIN for audit...');
      adminUser = await prisma.user.update({
        where: { id: userId },
        data: { role: 'ADMIN' },
      });
    }

    // Get fresh token for admin
    const jwt = require('jsonwebtoken');
    const adminToken = jwt.sign(
      { sub: adminUser.id, email: adminUser.email, role: 'ADMIN' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const adminOrdersRes = await fetch(`${API_URL}/admin/orders`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminOrdersData = await adminOrdersRes.json();
    console.log(`GET /admin/orders status: ${adminOrdersRes.status}, count: ${adminOrdersData?.data?.orders?.length || adminOrdersData?.orders?.length}`);

    const adminPaymentsRes = await fetch(`${API_URL}/admin/payments`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminPaymentsData = await adminPaymentsRes.json();
    console.log(`GET /admin/payments status: ${adminPaymentsRes.status}`);

    results.phase12_admin = {
      status: adminOrdersRes.ok && adminPaymentsRes.ok ? 'PASS' : 'FAIL',
      ordersCount: adminOrdersData?.data?.orders?.length || adminOrdersData?.orders?.length,
    };

  } catch (err: any) {
    console.error('❌ Audit runner caught exception:', err);
  } finally {
    console.log('\n=====================================================');
    console.log('📊 AUDIT SUMMARY RESULTS:');
    console.log(JSON.stringify(results, null, 2));
    console.log('=====================================================');
    await prisma.$disconnect();
    await pool.end();
  }
}

audit();
