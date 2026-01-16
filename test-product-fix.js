const http = require('http');

const postData = JSON.stringify({
  productName: 'Paneer Tikka',
  price: 250,
  category: ['veg'],
  description: 'Grilled cottage cheese with spices'
});

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/product/add/696a5b4a0b28ca8a15e70d3a',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('\n✓ Response Status:', res.statusCode);
    console.log('Response Body:');
    try {
      console.log(JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
      console.log(data);
    }
    process.exit(res.statusCode >= 200 && res.statusCode < 300 ? 0 : 1);
  });
});

req.on('error', (e) => {
  console.error('✗ Error:', e.message);
  process.exit(1);
});

console.log('Sending POST request to /product/add/696a5b4a0b28ca8a15e70d3a');
console.log('Body:', JSON.stringify(JSON.parse(postData), null, 2));

req.write(postData);
req.end();

setTimeout(() => {
  console.log('\n✗ TIMEOUT - No response from server');
  process.exit(1);
}, 5000);
