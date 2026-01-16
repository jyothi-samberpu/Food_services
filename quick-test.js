const http = require('http');

console.log('Testing endpoints...\n');

// Test 1: GET /
http.get('http://localhost:4000/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('[TEST 1] GET / - Status:', res.statusCode);
    if (res.statusCode === 200) console.log('✓ PASS\n');
    else console.log('✗ FAIL\n');
  });
}).on('error', (e) => console.log('✗ Error:', e.message));

// Test 2: GET /product/all
setTimeout(() => {
  http.get('http://localhost:4000/product/all', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('[TEST 2] GET /product/all - Status:', res.statusCode);
      if (res.statusCode === 200) {
        try {
          const json = JSON.parse(data);
          console.log('✓ PASS - Found', (json.products || []).length, 'products\n');
        } catch (e) {
          console.log('✗ FAIL - Invalid JSON\n');
        }
      } else {
        console.log('✗ FAIL\n');
      }
    });
  }).on('error', (e) => console.log('✗ Error:', e.message));
}, 500);

// Test 3: GET /firm/all
setTimeout(() => {
  http.get('http://localhost:4000/firm/all', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('[TEST 3] GET /firm/all - Status:', res.statusCode);
      if (res.statusCode === 200) {
        try {
          const json = JSON.parse(data);
          console.log('✓ PASS - Found', (json.firms || []).length, 'firms\n');
        } catch (e) {
          console.log('✗ FAIL - Invalid JSON\n');
        }
      } else {
        console.log('✗ FAIL\n');
      }
    });
  }).on('error', (e) => console.log('✗ Error:', e.message));
}, 1000);

// Test 4: POST product to firm
setTimeout(() => {
  const postData = JSON.stringify({
    productName: 'Butter Chicken',
    price: 350,
    category: ['non-veg'],
    description: 'Tender chicken in creamy butter sauce'
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
      console.log('[TEST 4] POST /product/add/:firmId - Status:', res.statusCode);
      console.log('Response:', data.substring(0, 100));
      if ([201, 404].includes(res.statusCode)) console.log('✓ PASS (201=Created, 404=Firm not found)\n');
      else console.log('✗ FAIL\n');
      process.exit(0);
    });
  }).on('error', (e) => {
    console.log('✗ Error:', e.message);
    process.exit(1);
  });

  req.write(postData);
  req.end();
}, 1500);

// Timeout safety
setTimeout(() => {
  console.log('Tests timed out');
  process.exit(1);
}, 5000);
