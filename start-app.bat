@echo off
cls
title MEFTAHI IMMO - Start Application
color 0A

echo =====================================================
echo MEFTAHI IMMO - APPLICATION START
echo =====================================================
echo.

echo Current Supabase Project: https://pvfzwnieerksnfusyidy.supabase.co
echo Storage Bucket: listings-media (Public)
echo.

echo This script will:
echo 1. Start the Next.js development server
echo 2. Open your browser to http://localhost:3000
echo.

echo Press any key to continue...
pause >nul

echo.
echo Starting application...
echo.

cd /d D:\BIZERTA_IMMO
start http://localhost:3000
npm run dev

echo.
echo Application started!
echo Visit http://localhost:3000 in your browser
echo.

echo Press Ctrl+C to stop the server
pause >nul