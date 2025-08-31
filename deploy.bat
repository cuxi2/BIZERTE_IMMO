@echo off
REM Deployment script for MEFTAHI IMMO
REM This script builds and prepares the application for deployment

echo 🚀 Starting MEFTAHI IMMO deployment process...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Check if build succeeds
echo 🏗️ Building the application...
npm run build
if %errorlevel% equ 0 (
    echo ✅ Build successful!
) else (
    echo ❌ Build failed. Please check the errors above.
    exit /b 1
)

echo 🎉 Deployment preparation completed!
echo Next steps:
echo 1. Set up your Supabase project
echo 2. Configure environment variables
echo 3. Deploy to your hosting platform