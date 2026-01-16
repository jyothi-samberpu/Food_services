// Test script for /firm/add-firm endpoint
const http = require('http');
const fs = require('fs');
const path = require('path');

function makeRequest(method, path, data = null, token = null) {
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

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = body ? JSON.parse(body) : null;
                    resolve({
                        status: res.statusCode,
                        body: parsed
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        body: body
                    });
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function testFirmAddition() {
    try {
        console.log('\n' + '='.repeat(60));
        console.log('🧪 TESTING /firm/add-firm ENDPOINT');
        console.log('='.repeat(60) + '\n');

        // Step 1: Register vendor
        console.log('STEP 1: Register Vendor');
        console.log('-'.repeat(60));
        const vendorData = {
            username: 'firmvendor1',
            email: `firmvendor${Date.now()}@test.com`,
            password: 'Password123'
        };
        console.log('Request:', JSON.stringify(vendorData, null, 2));
        
        const registerRes = await makeRequest('POST', '/vendor/register', vendorData);
        console.log(`Status: ${registerRes.status}`);
        console.log('Response:', JSON.stringify(registerRes.body, null, 2));

        if (registerRes.status !== 201) {
            console.log('❌ Registration failed!');
            return;
        }

        const vendorId = registerRes.body.vendorId;
        console.log('✓ Vendor registered successfully');
        console.log(`✓ Vendor ID: ${vendorId}\n`);

        // Step 2: Login vendor
        console.log('STEP 2: Login Vendor');
        console.log('-'.repeat(60));
        const loginData = {
            email: vendorData.email,
            password: vendorData.password
        };
        console.log('Request:', JSON.stringify(loginData, null, 2));
        
        const loginRes = await makeRequest('POST', '/vendor/login', loginData);
        console.log(`Status: ${loginRes.status}`);
        console.log('Response:', JSON.stringify(loginRes.body, null, 2));

        if (loginRes.status !== 200 || !loginRes.body.token) {
            console.log('❌ Login failed!');
            return;
        }

        const token = loginRes.body.token;
        console.log('✓ Vendor logged in successfully');
        console.log(`✓ Token: ${token.substring(0, 30)}...\n`);

        // Step 3: Test /firm/add-firm endpoint
        console.log('STEP 3: Test /firm/add-firm Endpoint');
        console.log('-'.repeat(60));
        
        // Test 3a: Without token (should fail)
        console.log('\n3A: Without Token (Should Fail)');
        const firmDataNoToken = {
            firmname: 'Pizza Palace',
            area: 'downtown',
            category: '["non-veg"]',
            region: 'north-indian',
            offer: '50% off'
        };
        console.log('Request:', JSON.stringify(firmDataNoToken, null, 2));
        
        const noTokenRes = await makeRequest('POST', '/firm/add-firm', firmDataNoToken);
        console.log(`Status: ${noTokenRes.status}`);
        console.log('Response:', JSON.stringify(noTokenRes.body, null, 2));
        
        if (noTokenRes.status === 401 || noTokenRes.status === 403) {
            console.log('✓ Correctly rejected request without token\n');
        } else {
            console.log('⚠ Unexpected status code\n');
        }

        // Test 3b: With token (should work)
        console.log('3B: With Valid Token (Should Work)');
        const firmData = {
            firmname: `Pizza Palace ${Date.now()}`,
            area: 'downtown',
            category: '["non-veg"]',
            region: 'north-indian',
            offer: '50% off'
        };
        console.log('Request:', JSON.stringify(firmData, null, 2));
        console.log(`Authorization: Bearer ${token.substring(0, 30)}...`);
        
        const firmRes = await makeRequest('POST', '/firm/add-firm', firmData, token);
        console.log(`Status: ${firmRes.status}`);
        console.log('Response:', JSON.stringify(firmRes.body, null, 2));

        if (firmRes.status === 201) {
            console.log('✓ Firm added successfully!');
            console.log(`✓ Firm ID: ${firmRes.body.firm._id}\n`);
        } else if (firmRes.status === 400) {
            console.log('⚠ Bad request - check validation');
            console.log('Error details:', firmRes.body.error || firmRes.body.message);
        } else {
            console.log('❌ Failed to add firm');
        }

        // Step 4: Get all firms
        console.log('STEP 4: Get All Firms');
        console.log('-'.repeat(60));
        
        const allFirmsRes = await makeRequest('GET', '/firm/all');
        console.log(`Status: ${allFirmsRes.status}`);
        console.log(`Total Firms: ${allFirmsRes.body.firms ? allFirmsRes.body.firms.length : 0}`);
        
        if (allFirmsRes.body.firms && allFirmsRes.body.firms.length > 0) {
            console.log('✓ Sample Firm:', JSON.stringify(allFirmsRes.body.firms[0], null, 2));
        }

        console.log('\n' + '='.repeat(60));
        console.log('🎉 TESTING COMPLETE');
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run tests
testFirmAddition();
