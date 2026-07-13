const API_URL = 'http://localhost:5000/api/v1';

async function runOrderTests() {
  console.log('🏁 --- STARTING PHASE 5A ORDER ENGINE E2E TESTS ---');
  let customerToken = '';
  let adminToken = '';
  let shippingAddressId = '';
  let billingAddressId = '';
  let orderId = '';
  let orderNumber = '';

  // 1. Customer Login
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'qa.customer@test.twothreadsstudio.com', password: 'Test@12345' })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      console.log('✅ 1. Customer Login: SUCCESS');
      customerToken = data.data.accessToken;
    } else {
      console.log('❌ 1. Customer Login: FAILED', data);
      return;
    }
  } catch (e) {
    console.log('❌ 1. Customer Login Error', e);
    return;
  }

  // 2. Admin Login
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@twothreads.com', password: 'Admin@12345' })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      console.log('✅ 2. Admin Login: SUCCESS');
      adminToken = data.data.accessToken;
    } else {
      console.log('❌ 2. Admin Login: FAILED', data);
      return;
    }
  } catch (e) {
    console.log('❌ 2. Admin Login Error', e);
    return;
  }

  // 3. Create Shipping/Billing Address
  try {
    const res = await fetch(`${API_URL}/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({
        fullName: 'Jane Doe',
        phone: '9876543210',
        line1: '123, Craft Lane',
        line2: 'Artisan Square',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'IN',
        postalCode: '560001',
        type: 'HOME'
      })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      console.log('✅ 3. Create Address: SUCCESS');
      shippingAddressId = data.address.id;
      billingAddressId = data.address.id;
    } else {
      console.log('❌ 3. Create Address: FAILED', data);
      return;
    }
  } catch (e) {
    console.log('❌ 3. Create Address Error', e);
    return;
  }

  // 4. Add items to cart (Meadow Floral Hoop Kit)
  try {
    // Clear cart first to make it clean
    await fetch(`${API_URL}/cart`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });

    const res = await fetch(`${API_URL}/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({
        productId: 'prod-p1',
        quantity: 2,
        customization: { hoopColor: 'Natural Bamboo' },
        giftWrap: true,
        engravingText: 'For Jane'
      })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      console.log('✅ 4. Add to Cart: SUCCESS');
    } else {
      console.log('❌ 4. Add to Cart: FAILED', data);
      return;
    }
  } catch (e) {
    console.log('❌ 4. Add to Cart Error', e);
    return;
  }

  // 5. Create Order (Checkout)
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({
        shippingAddressId,
        billingAddressId,
        notes: 'Leave at front desk please.',
        paymentMethod: 'razorpay'
      })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      console.log(`✅ 5. Checkout & Create Order: SUCCESS (Order No: ${data.order.orderNumber})`);
      orderId = data.order.id;
      orderNumber = data.order.orderNumber;
    } else {
      console.log('❌ 5. Checkout & Create Order: FAILED', data);
      return;
    }
  } catch (e) {
    console.log('❌ 5. Checkout & Create Order Error', e);
    return;
  }

  // 6. Get Customer Orders List
  try {
    const res = await fetch(`${API_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    const data = await res.json();
    if (res.ok && data.success && data.orders.length > 0) {
      console.log('✅ 6. Get Customer Orders List: SUCCESS');
    } else {
      console.log('❌ 6. Get Customer Orders List: FAILED', data);
    }
  } catch (e) {
    console.log('❌ 6. Get Customer Orders List Error', e);
  }

  // 7. Get Customer Order Detail
  try {
    const res = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    const data = await res.json();
    if (res.ok && data.success && data.order.id === orderId) {
      console.log('✅ 7. Get Customer Order Detail: SUCCESS');
    } else {
      console.log('❌ 7. Get Customer Order Detail: FAILED', data);
    }
  } catch (e) {
    console.log('❌ 7. Get Customer Order Detail Error', e);
  }

  // 8. Download Invoice PDF
  try {
    const res = await fetch(`${API_URL}/orders/${orderId}/invoice`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    if (res.ok && res.headers.get('content-type') === 'application/pdf') {
      const buffer = await res.arrayBuffer();
      console.log(`✅ 8. Download Invoice PDF: SUCCESS (${buffer.byteLength} bytes)`);
    } else {
      console.log('❌ 8. Download Invoice PDF: FAILED status:', res.status, 'header:', res.headers.get('content-type'));
    }
  } catch (e) {
    console.log('❌ 8. Download Invoice PDF Error', e);
  }

  // 9. Admin List Orders
  try {
    const res = await fetch(`${API_URL}/admin/orders`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (res.ok && data.success && data.orders.length > 0) {
      console.log('✅ 9. Admin List Orders: SUCCESS');
    } else {
      console.log('❌ 9. Admin List Orders: FAILED', data);
    }
  } catch (e) {
    console.log('❌ 9. Admin List Orders Error', e);
  }

  // 10. Admin Update Order Status to PROCESSING
  try {
    const res = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({
        status: 'PROCESSING',
        note: 'Materials prepared. Moving to artisan desk.'
      })
    });
    const data = await res.json();
    if (res.ok && data.success && data.order.orderStatus === 'PROCESSING') {
      console.log('✅ 10. Admin Update Status: SUCCESS');
    } else {
      console.log('❌ 10. Admin Update Status: FAILED', data);
    }
  } catch (e) {
    console.log('❌ 10. Admin Update Status Error', e);
  }

  // 11. Customer Cancel Order (Should be BLOCKED because it is in PROCESSING)
  try {
    const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({
        reason: 'Change my mind'
      })
    });
    const data = await res.json();
    if (!res.ok && data.message.includes('stage')) {
      console.log('✅ 11. Customer Cancel Order (Blocked as expected): SUCCESS');
    } else {
      console.log('❌ 11. Customer Cancel Order (Allowed unexpectedly or failed):', res.status, data);
    }
  } catch (e) {
    console.log('❌ 11. Customer Cancel Order Error', e);
  }

  // 12. Create a second order and cancel it immediately (Should be ALLOWED because it is in PENDING)
  try {
    // Add item to cart again
    await fetch(`${API_URL}/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({
        productId: 'prod-p1',
        quantity: 1
      })
    });

    // Checkout
    const checkoutRes = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({
        shippingAddressId,
        billingAddressId
      })
    });
    const checkoutData = await checkoutRes.json();
    const secondOrderId = checkoutData.order.id;

    // Cancel
    const cancelRes = await fetch(`${API_URL}/orders/${secondOrderId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({
        reason: 'Decided not to purchase today'
      })
    });
    const cancelData = await cancelRes.json();
    if (cancelRes.ok && cancelData.success && cancelData.order.orderStatus === 'CANCELLED') {
      console.log('✅ 12. Customer Cancel Order (Allowed in PENDING): SUCCESS');
    } else {
      console.log('❌ 12. Customer Cancel Order (Failed to cancel or block):', cancelRes.status, cancelData);
    }
  } catch (e) {
    console.log('❌ 12. Customer Cancel Order Error', e);
  }

  console.log('🏁 --- ENDING PHASE 5A ORDER ENGINE E2E TESTS ---');
}

runOrderTests();
