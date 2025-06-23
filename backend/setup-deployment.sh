#!/bin/bash

# Aroma Perfume - Pre-Deployment Setup Script
# Run this script to prepare your application for deployment

echo "🚀 Aroma Perfume - Pre-Deployment Setup"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: This script should be run from the backend directory"
    echo "Please navigate to the backend folder and try again"
    exit 1
fi

echo "📋 Checking backend configuration..."

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    echo "❌ Error: .env.example file not found"
    exit 1
fi

# Create .env from example if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created! Please fill in your actual values."
else
    echo "✅ .env file already exists"
fi

# Check package.json scripts
echo "📦 Checking package.json scripts..."
if grep -q '"start": "node server.js"' package.json; then
    echo "✅ Start script configured correctly"
else
    echo "❌ Warning: Start script may need adjustment for deployment"
fi

# Check if server.js exists
if [ -f "server.js" ]; then
    echo "✅ Server entry point found"
else
    echo "❌ Error: server.js not found"
    exit 1
fi

echo ""
echo "🔧 Next Steps for Deployment:"
echo "1. Fill in your .env file with actual values"
echo "2. Set up MongoDB Atlas database"
echo "3. Configure Firebase project"
echo "4. Get Gemini API key"
echo "5. Deploy to Render (backend) and Vercel (frontend)"
echo ""
echo "📖 See DEPLOYMENT-GUIDE.md for detailed instructions"
echo ""
echo "✅ Pre-deployment setup complete!"
