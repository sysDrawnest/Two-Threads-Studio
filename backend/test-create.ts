import axios from 'axios';

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/v1/products', {
      name: "Test Product Mul Images",
      description: "Test",
      categoryId: "cm02v893x0000test",
      price: 100,
      images: [
        { url: "http://example.com/1.jpg", isPrimary: true, sortOrder: 0 },
        { url: "http://example.com/2.jpg", isPrimary: false, sortOrder: 1 },
        { url: "http://example.com/3.jpg", isPrimary: false, sortOrder: 2 }
      ]
    });
    console.log(res.data);
  } catch (err: any) {
    console.error(err.response?.data || err.message);
  }
}

test();
