#!/bin/bash

# 🚀 AUTOMATED LOCAL TESTING SCRIPT
# Run this to test your app locally before deploying to production

echo "================================"
echo "🍕 Food Services - Local Setup"
echo "================================"
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed. Install from nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check .env file
if [ ! -f Backend/.env ]; then
    echo "⚠️  Backend/.env not found"
    echo "Creating from template..."
    cp Backend/.env.example Backend/.env
    echo "❌ Please edit Backend/.env with your MongoDB URL and JWT secret"
    echo "📝 Edit: Backend/.env"
    exit 1
fi

echo "✅ Backend/.env exists"
echo ""

# Start development servers
echo "🚀 Starting servers..."
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:4000"
echo ""
echo "Press CTRL+C to stop"
echo ""

npm run dev
