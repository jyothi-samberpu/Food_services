// Test script for API endpoints
const http = require('http');

function testEndpoint(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 4000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    body: body ? JSON.parse(body) : null
                });
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function runTests() {
    console.log('\n===== API TESTING =====\n');

    // Test 1: Root endpoint
    console.log('TEST 1: GET / (Root Endpoint)');
    try {
        const test1 = await testEndpoint('GET', '/');
        console.log(`✓ Status: ${test1.status}`);
        console.log('Response:', JSON.stringify(test1.body, null, 2));
    } catch (err) {
        console.log('✗ Error:', err.message);
    }

    console.log('\n---\n');

    // Test 2: Vendor Registration
    console.log('TEST 2: POST /vendor/register (Vendor Registration)');
    const vendor = {
        username: 'testvendor1',
        email: 'vendor1@test.com',
        password: 'Password123'
    };
    try {
        const test2 = await testEndpoint('POST', '/vendor/register', vendor);
        console.log(`✓ Status: ${test2.status}`);
        console.log('Response:', JSON.stringify(test2.body, null, 2));
        
        if (test2.body && test2.body.vendorId) {
            global.vendorId = test2.body.vendorId;
            global.vendorEmail = vendor.email;
            global.vendorPassword = vendor.password;
        }
    } catch (err) {
        console.log('✗ Error:', err.message);
    }

    console.log('\n---\n');

    // Test 3: Duplicate Registration (should fail)
    console.log('TEST 3: POST /vendor/register (Duplicate Email - Should Fail)');
    try {
        const test3 = await testEndpoint('POST', '/vendor/register', vendor);
        console.log(`Status: ${test3.status}`);
        console.log('Response:', JSON.stringify(test3.body, null, 2));
        if (test3.status === 400) {
            console.log('✓ Correctly rejected duplicate email');
        }
    } catch (err) {
        console.log('✗ Error:', err.message);
    }

    console.log('\n---\n');

    // Test 4: Vendor Login
    if (global.vendorEmail) {
        console.log('TEST 4: POST /vendor/login (Vendor Login)');
        const loginData = {
            email: global.vendorEmail,
            password: global.vendorPassword
        };
        try {
            const test4 = await testEndpoint('POST', '/vendor/login', loginData);
            console.log(`✓ Status: ${test4.status}`);
            console.log('Response:', JSON.stringify(test4.body, null, 2));
            if (test4.body && test4.body.token) {
                global.token = test4.body.token;
                console.log('✓ Token received:', test4.body.token.substring(0, 20) + '...');
            }
        } catch (err) {
            console.log('✗ Error:', err.message);
        }
    }

    console.log('\n---\n');

    // Test 5: Get All Vendors
    console.log('TEST 5: GET /vendor/all-vendors (Get All Vendors)');
    try {
        const test5 = await testEndpoint('GET', '/vendor/all-vendors');
        console.log(`✓ Status: ${test5.status}`);
        console.log('Vendors found:', test5.body.vendors ? test5.body.vendors.length : 0);
        console.log('Response:', JSON.stringify(test5.body, null, 2));
    } catch (err) {
        console.log('✗ Error:', err.message);
    }

    console.log('\n===== ALL TESTS COMPLETED =====\n');
}

// Run all tests
runTests().catch(console.error);
