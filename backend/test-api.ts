import axios from 'axios';

async function testLogin() {
  try {
    const res = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'qa.customer@test.twothreadsstudio.com',
      password: 'Test@12345'
    });
    console.log('Login success:', res.data);
  } catch (err: any) {
    console.error('Login failed:', err.response?.data || err.message);
  }
}

testLogin();
