// Test script for /firm/add-firm endpoint with multipart/form-data
const http = require('http');
const FormData = require('form-data');
const fs = require('fs');

function makeRequest(method, path, data = null, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 4000,
            path: path,
            method: method,
            headers: data && data.getHeaders ? data.getHeaders() : {
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
        if (data) {
            if (data.getHeaders) {
                data.pipe(req);
            } else {
                req.write(JSON.stringify(data));
                req.end();
            }
        } else {
            req.end();
        }
    });
}

async function testFirmAddition() {
    try {
        console.log('\n' + '='.repeat(70));
        console.log('🧪 TESTING /firm/add-firm ENDPOINT WITH MULTIPART FORM-DATA');
        console.log('='.repeat(70) + '\n');

        // Step 1: Register vendor
        console.log('STEP 1: Register Vendor');
        console.log('-'.repeat(70));
        const vendorData = {
            username: 'firmvendor2',
            email: `firmvendor${Date.now()}@test.com`,
            password: 'Password123'
        };
        console.log('Registering vendor:', vendorData.email);
        
        const registerRes = await makeRequest('POST', '/vendor/register', vendorData);
        console.log(`✓ Status: ${registerRes.status}`);

        if (registerRes.status !== 201) {
            console.log('❌ Registration failed!');
            return;
        }

        const vendorId = registerRes.body.vendorId;
        console.log(`✓ Vendor ID: ${vendorId}\n`);

        // Step 2: Login vendor
        console.log('STEP 2: Login Vendor');
        console.log('-'.repeat(70));
        const loginData = {
            email: vendorData.email,
            password: vendorData.password
        };
        
        const loginRes = await makeRequest('POST', '/vendor/login', loginData);
        console.log(`✓ Status: ${loginRes.status}`);

        if (loginRes.status !== 200 || !loginRes.body.token) {
            console.log('❌ Login failed!');
            return;
        }

        const token = loginRes.body.token;
        console.log(`✓ Token received: ${token.substring(0, 40)}...\n`);

        // Step 3: Add Firm with multipart data
        console.log('STEP 3: Add Firm with multipart/form-data');
        console.log('-'.repeat(70));
        
        // Create a FormData object for multipart upload
        const form = new FormData();
        form.append('firmname', `Pizza Palace ${Date.now()}`);
        form.append('area', 'downtown');
        form.append('category', 'non-veg');
        form.append('region', 'north-indian');
        form.append('offer', '50% off');
        
        // Optionally add an image file
        try {
            // Create a dummy image file
            const dummyImagePath = 'c:\\Users\\jyoth\\Food_services\\Backend\\uploads\\dummy.jpg';
            if (!fs.existsSync('c:\\Users\\jyoth\\Food_services\\Backend\\uploads')) {
                fs.mkdirSync('c:\\Users\\jyoth\\Food_services\\Backend\\uploads', { recursive: true });
            }
            if (!fs.existsSync(dummyImagePath)) {
                fs.writeFileSync(dummyImagePath, Buffer.from([0xFF, 0xD8, 0xFF])); // minimal JPEG header
            }
            form.append('image', fs.createReadStream(dummyImagePath));
            console.log('✓ Image file attached');
        } catch (e) {
            console.log('⚠ No image file (this is optional)');
        }
        
        console.log('Sending multipart data...');
        const firmRes = await makeRequest('POST', '/firm/add-firm', form, token);
        console.log(`Status: ${firmRes.status}`);
        console.log('Response:', JSON.stringify(firmRes.body, null, 2));

        if (firmRes.status === 201) {
            console.log('✓✓✓ FIRM ADDED SUCCESSFULLY! ✓✓✓');
            console.log(`Firm ID: ${firmRes.body.firm._id}`);
            console.log(`Firm Name: ${firmRes.body.firm.firmname}`);
            console.log(`Vendor: ${firmRes.body.firm.vendor}\n`);
        } else if (firmRes.status === 400) {
            console.log('⚠ Bad request - check validation');
            console.log('Error:', firmRes.body.error);
        } else {
            console.log('❌ Failed to add firm');
        }

        // Step 4: Get all firms
        console.log('STEP 4: Get All Firms');
        console.log('-'.repeat(70));
        
        const allFirmsRes = await makeRequest('GET', '/firm/all');
        console.log(`Status: ${allFirmsRes.status}`);
        console.log(`Total Firms: ${allFirmsRes.body.firms ? allFirmsRes.body.firms.length : 0}`);
        
        if (allFirmsRes.body.firms && allFirmsRes.body.firms.length > 0) {
            console.log('✓ Latest Firm:', JSON.stringify(allFirmsRes.body.firms[0], null, 2));
        }

        console.log('\n' + '='.repeat(70));
        console.log('🎉 TESTING COMPLETE');
        console.log('='.repeat(70) + '\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    }
}

// Check if form-data package is installed
try {
    require('form-data');
    testFirmAddition();
} catch (e) {
    console.log('⚠ form-data package not installed. Installing...');
    console.log('Run: npm install form-data');
    console.log('\nTesting with JSON instead (no file upload)...\n');
    
    // Fallback test without form-data
    const http = require('http');
    
    async function simpleTest() {
        try {
            // Register and login
            let res = await makeRequest('POST', '/vendor/register', {
                username: 'testvendor',
                email: `vendor${Date.now()}@test.com`,
                password: 'Password123'
            });
            
            let loginRes = await makeRequest('POST', '/vendor/login', {
                email: `vendor${Date.now()}@test.com`,
                password: 'Password123'
            });
            
            console.log('Note: Firm endpoint requires multipart/form-data for image uploads');
            console.log('Please install form-data: npm install form-data');
        } catch(err) {
            console.error('Error:', err.message);
        }
    }
    
    simpleTest();
}

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
                    resolve({
                        status: res.statusCode,
                        body: body ? JSON.parse(body) : null
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
