#!/usr/bin/env node

/**
 * COMPREHENSIVE ENDPOINT TEST SUITE
 * Senior Engineer - Full API Validation
 */

const http = require('http');

const tests = [
  {
    name: 'GET / - Home Endpoint',
    method: 'GET',
    path: '/',
    body: null,
    expectStatus: 200
  },
  {
    name: 'GET /product/all - Get All Products',
    method: 'GET',
    path: '/product/all',
    body: null,
    expectStatus: 200
  },
  {
    name: 'GET /firm/all - Get All Firms',
    method: 'GET',
    path: '/firm/all',
    body: null,
    expectStatus: 200
  },
  {
    name: 'POST /product/add/696a5b4a0b28ca8a15e70d3a - Add Product to Firm',
    method: 'POST',
    path: '/product/add/696a5b4a0b28ca8a15e70d3a',
    body: JSON.stringify({
      productName: 'Paneer Tikka',
      price: 250,
      category: ['veg'],
      description: 'Grilled cottage cheese with spices'
    }),
    expectStatus: [201, 404] // 404 if firm doesn't exist
  }
];

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

    const timeout = setTimeout(() => {
      resolve({
        test: test.name,
        error: 'TIMEOUT',
        success: false
      });
    }, 5000);

    const req = http.request(options, (res) => {
      clearTimeout(timeout);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const expectedStatuses = Array.isArray(test.expectStatus) ? test.expectStatus : [test.expectStatus];
        const success = expectedStatuses.includes(res.statusCode);
        
        resolve({
          test: test.name,
          status: res.statusCode,
          success: success,
          response: data
        });
      });
    });

    req.on('error', (e) => {
      clearTimeout(timeout);
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

async function runTests() {
  console.log('\n' + '='.repeat(80));
  console.log('ENDPOINT TEST SUITE - SENIOR ENGINEER VALIDATION');
  console.log('='.repeat(80) + '\n');

  let passed = 0;
  let failed = 0;
  const results = [];

  for (const test of tests) {
    const result = await makeRequest(test);
    results.push(result);

    const icon = result.success ? '✓' : '✗';
    const statusText = result.status ? `[${result.status}]` : `[ERROR: ${result.error}]`;
    
    console.log(`${icon} ${result.test}`);
    console.log(`  ${statusText}`);
    
    if (result.response) {
      try {
        const parsed = JSON.parse(result.response);
        console.log(`  Response Preview:`, JSON.stringify(parsed).substring(0, 100) + '...');
      } catch (e) {
        console.log(`  Response:`, result.response.substring(0, 100));
      }
    }
    
    if (result.error) {
      console.log(`  Error:`, result.error);
    }

    console.log('');
    
    if (result.success) passed++;
    else failed++;
  }

  console.log('='.repeat(80));
  console.log(`SUMMARY: ${passed} Passed ✓ | ${failed} Failed ✗ | Total: ${passed + failed}`);
  console.log('='.repeat(80) + '\n');
  
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
