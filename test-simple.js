const http = require('http');

const req = http.get('http://localhost:4000/product/all', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Data:', data);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('ERROR:', e.message);
  process.exit(1);
});

setTimeout(() => {
  console.log('TIMEOUT - No response from server');
  process.exit(1);
}, 5000);
