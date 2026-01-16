#!/usr/bin/env node
/**
 * Comprehensive Backend Startup Diagnostic
 * This will attempt to start the server and capture all errors
 */

const path = require('path');
process.chdir(path.join(__dirname));

console.log('\n' + '='.repeat(80));
console.log('BACKEND STARTUP DIAGNOSTIC');
console.log('='.repeat(80));
console.log('CWD:', process.cwd());
console.log('Node Version:', process.version);

try {
  console.log('\n[1] Loading environment...');
  require('dotenv').config();
  console.log('✓ Environment loaded');

  console.log('\n[2] Loading express and dependencies...');
  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  console.log('✓ Express and dependencies loaded');

  console.log('\n[3] Loading models...');
  const Vendor = require('./models/Vendor');
  const Firm = require('./models/Firm');
  const Product = require('./models/Product');
  console.log('✓ All models loaded');

  console.log('\n[4] Loading routers...');
  const vendorRouter = require('./router/vendorRouter');
  const firmRouter = require('./router/firmRouter');
  const productRouter = require('./router/productRouter');
  console.log('✓ All routers loaded');

  console.log('\n[5] Creating Express app...');
  const app = express();
  console.log('✓ Express app created');

  console.log('\n[6] Setting up middleware...');
  app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  console.log('✓ Middleware configured');

  console.log('\n[7] Setting up routes...');
  app.use("/vendor", vendorRouter);
  app.use("/firm", firmRouter);
  app.use("/product", productRouter);
  console.log('✓ Routes configured');

  console.log('\n[8] Adding home route...');
  app.get("/", (req, res) => {
    res.json({ message: "Welcome to Venket Food Services API" });
  });
  console.log('✓ Home route added');

  console.log('\n[9] Connecting to MongoDB...');
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    throw new Error('MONGO_URL not found in environment');
  }
  console.log('Mongo URL:', mongoUrl.substring(0, 50) + '...');

  mongoose
    .connect(mongoUrl)
    .then(() => {
      console.log('✓ MongoDB connected successfully');
      
      console.log('\n[10] Starting server...');
      const PORT = process.env.PORT || 4000;
      app.listen(PORT, () => {
        console.log('✓ Server listening on port', PORT);
        console.log('\n' + '='.repeat(80));
        console.log('SERVER READY FOR TESTING');
        console.log('='.repeat(80) + '\n');
      });
    })
    .catch((error) => {
      console.error('✗ MongoDB connection failed:', error.message);
      process.exit(1);
    });

} catch (error) {
  console.error('\n✗ STARTUP ERROR:');
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  console.error('\n' + '='.repeat(80));
  process.exit(1);
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('\n✗ UNCAUGHT EXCEPTION:', error.message);
  console.error(error.stack);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('\n✗ UNHANDLED REJECTION:', reason);
  process.exit(1);
});
