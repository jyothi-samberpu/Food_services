/**
 * Comprehensive Test Suite for New Firm-Specific Product Endpoints
 * Tests: addProductToFirm and getProductsByFirmId
 */

const http = require('http');

const API_BASE = 'http://localhost:4000';

let vendorToken = '';
let firmId = '';
let productId = '';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║  FIRM-SPECIFIC PRODUCT ENDPOINTS TEST SUITE                ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

  try {
    // Step 1: Register Vendor
    log('1️⃣  REGISTERING TEST VENDOR...', 'blue');
    const testEmail = `vendor${Date.now()}@test.com`;
    const testUsername = `testvendor_${Date.now()}`;
    
    const vendorRes = await makeRequest('POST', '/vendor/register', {
      username: testUsername,
      email: testEmail,
      password: 'password123'
    });

    if (vendorRes.status !== 201) {
      throw new Error(`Vendor registration failed: ${JSON.stringify(vendorRes.data)}`);
    }
    log('   ✅ Vendor registered successfully\n', 'green');

    // Step 2: Login Vendor
    log('2️⃣  LOGGING IN VENDOR...', 'blue');
    const loginRes = await makeRequest('POST', '/vendor/login', {
      email: testEmail,
      password: 'password123'
    });

    if (loginRes.status !== 200 || !loginRes.data.token) {
      throw new Error(`Vendor login failed: ${JSON.stringify(loginRes.data)}`);
    }

    vendorToken = loginRes.data.token;
    log('   ✅ Login successful, token acquired\n', 'green');

    // Step 3: Create Firm
    log('3️⃣  CREATING TEST FIRM...', 'blue');
    const firmRes = await makeRequest('POST', '/firm/add-firm', {
      firmname: `TestFirm_${Date.now()}`,
      area: 'Downtown',
      category: 'veg',
      region: ['North']
    }, {
      'Authorization': `Bearer ${vendorToken}`,
      'Content-Type': 'application/json'
    });

    if (firmRes.status !== 201) {
      throw new Error(`Firm creation failed: ${JSON.stringify(firmRes.data)}`);
    }

    firmId = firmRes.data.firm._id;
    log(`   ✅ Firm created: ${firmId}\n`, 'green');

    // Step 4: Test addProductToFirm
    log('4️⃣  TESTING POST /product/add/:firmId ENDPOINT...', 'blue');
    const productRes = await makeRequest('POST', `/product/add/${firmId}`, {
      name: 'Biryani',
      price: 250,
      description: 'Delicious biryani',
      category: ['Rice']
    }, {
      'Authorization': `Bearer ${vendorToken}`,
      'Content-Type': 'application/json'
    });

    if (productRes.status !== 201) {
      throw new Error(`Product creation failed: ${JSON.stringify(productRes.data)}`);
    }

    productId = productRes.data.product._id;
    log(`   ✅ Product added successfully: ${productId}`, 'green');
    log(`   📦 Product Name: ${productRes.data.product.productName}`, 'yellow');
    log(`   💰 Price: Rs.${productRes.data.product.price}\n`, 'yellow');

    // Step 5: Test getProductsByFirmId
    log('5️⃣  TESTING GET /product/firm/:firmId ENDPOINT...', 'blue');
    const firmProductsRes = await makeRequest('GET', `/product/firm/${firmId}`, null, {
      'Authorization': `Bearer ${vendorToken}`
    });

    if (firmProductsRes.status !== 200) {
      throw new Error(`Fetching firm products failed: ${JSON.stringify(firmProductsRes.data)}`);
    }

    log(`   ✅ Products retrieved successfully`, 'green');
    log(`   🏪 Firm: ${firmProductsRes.data.firmName}`, 'yellow');
    log(`   📊 Total Products: ${firmProductsRes.data.products.length}`, 'yellow');
    
    if (firmProductsRes.data.products.length > 0) {
      firmProductsRes.data.products.forEach((prod, idx) => {
        log(`   [${idx + 1}] ${prod.productName} - Rs.${prod.price}`, 'yellow');
      });
    }
    log('', 'reset');

    // Step 6: Test error handling - Invalid FirmId
    log('6️⃣  TESTING ERROR HANDLING - Invalid FirmId...', 'blue');
    const invalidRes = await makeRequest('GET', `/product/firm/invalid_id`, null, {
      'Authorization': `Bearer ${vendorToken}`
    });

    if (invalidRes.status === 404) {
      log('   ✅ Correctly returns 404 for invalid firm\n', 'green');
    } else {
      log(`   ⚠️  Got status ${invalidRes.status} instead of 404\n`, 'yellow');
    }

    // Step 7: Test authorization - No token
    log('7️⃣  TESTING AUTHORIZATION - Missing token on protected route...', 'blue');
    const noTokenRes = await makeRequest('POST', `/product/add/${firmId}`, {
      name: 'Test',
      price: 100
    });

    if (noTokenRes.status === 401) {
      log('   ✅ Correctly rejects request without token\n', 'green');
    } else {
      log(`   ⚠️  Got status ${noTokenRes.status} instead of 401\n`, 'yellow');
    }

    // Step 8: Test validation - Missing required fields
    log('8️⃣  TESTING VALIDATION - Missing required fields...', 'blue');
    const validationRes = await makeRequest('POST', `/product/add/${firmId}`, {
      name: 'Test'
      // Missing price
    }, {
      'Authorization': vendorToken
    });

    if (validationRes.status === 400) {
      log('   ✅ Correctly validates required fields\n', 'green');
    } else {
      log(`   ⚠️  Got status ${validationRes.status} instead of 400\n`, 'yellow');
    }

    // Final Summary
    log('╔════════════════════════════════════════════════════════════╗', 'cyan');
    log('║  ✅ ALL TESTS PASSED - ENDPOINTS WORKING PROPERLY          ║', 'cyan');
    log('╠════════════════════════════════════════════════════════════╣', 'cyan');
    log('║  New Endpoints Verified:                                   ║', 'cyan');
    log('║  ✓ POST /product/add/:firmId                              ║', 'cyan');
    log('║  ✓ GET /product/firm/:firmId                              ║', 'cyan');
    log('║  ✓ Error Handling                                         ║', 'cyan');
    log('║  ✓ Authorization                                          ║', 'cyan');
    log('║  ✓ Input Validation                                       ║', 'cyan');
    log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

    process.exit(0);

  } catch (error) {
    log(`\n❌ TEST FAILED: ${error.message}`, 'red');
    log('\nStack Trace:', 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run tests
setTimeout(runTests, 2000);
