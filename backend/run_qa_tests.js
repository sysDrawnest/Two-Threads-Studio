const API_URL = 'http://localhost:5000/api/v1';

async function runTests() {
  console.log('--- STARTING API TESTS ---');
  let customerToken = '';
  let adminToken = '';
  let customerRefreshToken = '';

  // 1. Customer Login
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'qa.customer@test.twothreadsstudio.com', password: 'Test@12345' })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      console.log('✅ Customer Login Passed');
      customerToken = data.data.accessToken;
    } else {
      console.log('❌ Customer Login Failed', data);
    }
  } catch (e) {
    console.log('❌ Customer Login Error', e);
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
      console.log('✅ Admin Login Passed');
      adminToken = data.data.accessToken;
    } else {
      console.log('❌ Admin Login Failed', data);
    }
  } catch (e) {
    console.log('❌ Admin Login Error', e);
  }

  // 3. Customer Profile Get
  try {
    const res = await fetch(`${API_URL}/profile`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    const data = await res.json();
    if (res.ok && data.success) {
      console.log('✅ Get Profile Passed');
    } else {
      console.log('❌ Get Profile Failed', data);
    }
  } catch (e) {
    console.log('❌ Get Profile Error', e);
  }

  // 4. Cart Add Item
  try {
    const res = await fetch(`${API_URL}/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({
        productId: 'prod-p1',
        quantity: 1
      })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      console.log('✅ Add to Cart Passed');
    } else {
      console.log('❌ Add to Cart Failed', data);
    }
  } catch (e) {
    console.log('❌ Add to Cart Error', e);
  }

  // 5. Cart Get
  try {
    const res = await fetch(`${API_URL}/cart`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    const data = await res.json();
    if (res.ok && data.success) {
      console.log('✅ Get Cart Passed');
    } else {
      console.log('❌ Get Cart Failed', data);
    }
  } catch (e) {
    console.log('❌ Get Cart Error', e);
  }

  // 6. Wishlist Add
  try {
    const res = await fetch(`${API_URL}/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({
        productId: 'prod-p2'
      })
    });
    const data = await res.json();
    // It might return 409 if already exists, which is also fine
    if (res.ok && data.success) {
      console.log('✅ Add to Wishlist Passed');
    } else if (res.status === 409) {
      console.log('✅ Add to Wishlist Passed (Already in wishlist)');
    } else {
      console.log('❌ Add to Wishlist Failed', data);
    }
  } catch (e) {
    console.log('❌ Add to Wishlist Error', e);
  }

  // 7. Test Admin Protection
  try {
    const res = await fetch(`${API_URL}/admin/products`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    if (res.status === 403 || res.status === 401) {
      console.log('✅ Admin Protection Passed (Customer denied)');
    } else {
      console.log('❌ Admin Protection Failed', await res.json());
    }
  } catch (e) {
    console.log('❌ Admin Protection Error', e);
  }

  console.log('--- END API TESTS ---');
}

runTests();
