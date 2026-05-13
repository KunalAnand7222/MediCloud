const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'admin@medicloud.com',
      password: 'password123'
    });
    
    const token = loginRes.data.accessToken;
    console.log('Login success, got token');
    
    const statsRes = await axios.get('http://localhost:5000/api/v1/dashboard/admin', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Stats:', Object.keys(statsRes.data));
    console.log('Stats numbers:', statsRes.data.stats);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

test();
