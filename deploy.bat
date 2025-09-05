@echo off
cls
title MEFTAHI IMMO - Deployment
color 0A

echo =====================================================
echo MEFTAHI IMMO - COMPLETE DEPLOYMENT
echo =====================================================
echo.
echo Project: MEFTAHI IMMO (Real Estate Platform)
echo Location: d:\BIZERTA_IMMO
echo Supabase Project: https://pvfzwnieerksnfusyidy.supabase.co
echo.

echo This script will:
echo 1. Initialize your Supabase database
echo 2. Verify all tables and policies
echo 3. Start the development server
echo 4. Open your browser to the application
echo.

echo Press any key to begin deployment...
pause >nul

echo.
echo 1. Initializing Supabase database...
echo =================================
cd /d D:\BIZERTA_IMMO
call setup-new-db.bat

echo.
echo 2. Verifying database setup...
echo ===========================
node check-database.js

echo.
echo 3. Starting development server...
echo ==============================
start http://localhost:3000
npm run dev

echo.
echo 🎉 DEPLOYMENT COMPLETE!
echo ======================
echo.
echo Your MEFTAHI IMMO platform is now running at:
echo 🔗 http://localhost:3000
echo.
echo Admin Panel: http://localhost:3000/admin
echo Registration: http://localhost:3000/register
echo Login: http://localhost:3000/login
echo.
echo First user will automatically get admin role!
echo.
echo Press any key to exit...
pause >nul