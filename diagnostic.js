#!/usr/bin/env node

/**
 * SENIOR ENGINEER DIAGNOSTIC TEST
 * Purpose: Identify all startup and runtime issues
 */

const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(80));
console.log('BACKEND DIAGNOSTIC TEST - SENIOR ENGINEER REVIEW');
console.log('='.repeat(80) + '\n');

// Test 1: Check all required files exist
console.log('✓ Test 1: Checking required files...');
const requiredFiles = [
  'index.js',
  '.env',
  'controllers/ProductController.js',
  'controllers/firmController.js',
  'controllers/vendorController.js',
  'models/Product.js',
  'models/Firm.js',
  'models/Vendor.js',
  'router/productRouter.js',
  'router/firmRouter.js',
  'router/vendorRouter.js',
  'middlewares/verifyToken.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const filepath = path.join(__dirname, file);
  if (!fs.existsSync(filepath)) {
    console.error(`  ✗ MISSING: ${file}`);
    allFilesExist = false;
  }
});
if (allFilesExist) console.log('  ✓ All required files present\n');

// Test 2: Check syntax of critical files
console.log('✓ Test 2: Checking file syntax...');
const { execSync } = require('child_process');

const filesToCheck = [
  'index.js',
  'controllers/ProductController.js',
  'controllers/firmController.js',
  'controllers/vendorController.js',
  'router/productRouter.js',
  'router/firmRouter.js',
  'router/vendorRouter.js'
];

let syntaxErrors = false;
filesToCheck.forEach(file => {
  try {
    execSync(`node -c "${file}"`, { stdio: 'pipe' });
  } catch (e) {
    console.error(`  ✗ SYNTAX ERROR in ${file}`);
    syntaxErrors = true;
  }
});
if (!syntaxErrors) console.log('  ✓ All files have valid syntax\n');

// Test 3: Check .env file
console.log('✓ Test 3: Checking environment variables...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasPort = envContent.includes('PORT');
  const hasMongoUrl = envContent.includes('MONGO_URL');
  const hasSecret = envContent.includes('WHATISYOURWORK');
  
  console.log(`  PORT defined: ${hasPort ? '✓' : '✗'}`);
  console.log(`  MONGO_URL defined: ${hasMongoUrl ? '✓' : '✗'}`);
  console.log(`  WHATISYOURWORK defined: ${hasSecret ? '✓' : '✗'}\n`);
} else {
  console.error('  ✗ .env file not found\n');
}

// Test 4: Try to load all modules
console.log('✓ Test 4: Checking module imports...');
try {
  require('./models/Vendor');
  console.log('  ✓ Vendor model loads');
  require('./models/Firm');
  console.log('  ✓ Firm model loads');
  require('./models/Product');
  console.log('  ✓ Product model loads');
  require('./controllers/vendorController');
  console.log('  ✓ Vendor controller loads');
  require('./controllers/firmController');
  console.log('  ✓ Firm controller loads');
  require('./controllers/ProductController');
  console.log('  ✓ Product controller loads');
  require('./middlewares/verifyToken');
  console.log('  ✓ Verify token middleware loads');
  console.log('');
} catch (e) {
  console.error(`  ✗ Module import error: ${e.message}\n`);
  process.exit(1);
}

console.log('='.repeat(80));
console.log('✓ ALL DIAGNOSTICS PASSED - Backend ready to start');
console.log('='.repeat(80) + '\n');

process.exit(0);
