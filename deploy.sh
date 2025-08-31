#!/bin/bash

# Deployment script for MEFTAHI IMMO
# This script builds and prepares the application for deployment

echo "🚀 Starting MEFTAHI IMMO deployment process..."

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if build succeeds
echo "🏗️ Building the application..."
if npm run build
then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "🎉 Deployment preparation completed!"
echo "Next steps:"
echo "1. Set up your Supabase project"
echo "2. Configure environment variables"
echo "3. Deploy to your hosting platform"