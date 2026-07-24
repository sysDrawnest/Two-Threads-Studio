const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/v1/products', {
      name: "Test Product API Images",
      description: "Test Description",
      categoryId: "cm02v893x0000test", // Need a valid category ID if possible. We might get validation error.
      price: 150,
      images: [
        { url: "http://example.com/api1.jpg", isPrimary: true, sortOrder: 0 },
        { url: "http://example.com/api2.jpg", isPrimary: false, sortOrder: 1 },
        { url: "http://example.com/api3.jpg", isPrimary: false, sortOrder: 2 }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        // Admin auth header if required
      }
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

test();
