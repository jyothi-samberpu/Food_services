const http = require('http');

// Test configuration
const tests = [
  {
    name: 'GET / - Home endpoint',
    method: 'GET',
    path: '/',
    body: null
  },
  {
    name: 'GET /product/all - Get all products',
    method: 'GET',
    path: '/product/all',
    body: null
  },
  {
    name: 'GET /firm/all - Get all firms',
    method: 'GET',
    path: '/firm/all',
    body: null
  },
  {
    name: 'POST /product/add/696a5b4a0b28ca8a15e70d3a - Add product to firm',
    method: 'POST',
    path: '/product/add/696a5b4a0b28ca8a15e70d3a',
    body: JSON.stringify({
      name: 'Paneer Tikka',
      price: 250,
      category: ['Appetizer', 'Vegetarian'],
      description: 'Grilled cottage cheese with spices'
    })
  }
];

// Function to make HTTP request
function makeRequest(test) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: test.path,
      method: test.method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (test.body) {
      options.headers['Content-Length'] = Buffer.byteLength(test.body);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          test: test.name,
          status: res.statusCode,
          response: data,
          success: res.statusCode >= 200 && res.statusCode < 300
        });
      });
    });

    req.on('error', (e) => {
      resolve({
        test: test.name,
        error: e.message,
        success: false
      });
    });

    if (test.body) {
      req.write(test.body);
    }
    req.end();
  });
}

// Run all tests
async function runAllTests() {
  console.log('\n' + '='.repeat(80));
  console.log('BACKEND ENDPOINT TESTING SUITE');
  console.log('='.repeat(80) + '\n');

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await makeRequest(test);
    
    console.log(`\n[${result.success ? '✓ PASS' : '✗ FAIL'}] ${result.test}`);
    console.log(`Status: ${result.status || result.error}`);
    
    if (result.response) {
      try {
        const parsed = JSON.parse(result.response);
        console.log(`Response:`, JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.log(`Response:`, result.response);
      }
    }
    
    if (result.success) passed++;
    else failed++;
  }

  console.log('\n' + '='.repeat(80));
  console.log(`SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('='.repeat(80) + '\n');
  
  process.exit(failed > 0 ? 1 : 0);
}

// Start testing
runAllTests();
