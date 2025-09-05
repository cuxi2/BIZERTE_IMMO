@echo off
cls
title MEFTAHI IMMO - Simple Deployment
color 0A

echo =====================================================
echo MEFTAHI IMMO - SIMPLE DEPLOYMENT
echo =====================================================
echo.
echo Project: MEFTAHI IMMO (Real Estate Platform)
echo Location: d:\BIZERTA_IMMO
echo Supabase Project: https://pvfzwnieerksnfusyidy.supabase.co
echo.

echo DEPLOYMENT STEPS:
echo ================
echo 1. Initialize Database Tables
echo 2. Create Storage Bucket
echo 3. Start Application
echo 4. Register Admin User
echo.

echo Press any key to continue...
pause >nul

echo.
echo STEP 1: Initializing Database Tables
echo ====================================
echo Running database setup script...
call setup-new-db.bat

echo.
echo STEP 2: Create Storage Bucket
echo ===========================
echo Please manually create the storage bucket:
echo 1. Go to https://app.supabase.com/project/pvfzwnieerksnfusyidy
echo 2. Navigate to Storage
echo 3. Click "Create Bucket"
echo 4. Name it "listings-media"
echo 5. Set it as PUBLIC
echo 6. Click "Create Bucket"
echo.
echo Press any key after creating the bucket...
pause >nul

echo.
echo STEP 3: Starting Application
echo =========================
echo Opening browser and starting development server...
start http://localhost:3000
npm run dev

echo.
echo STEP 4: Register Admin User
echo ========================
echo.
echo After the server starts:
echo 1. Visit http://localhost:3000/register
echo 2. Create your admin account (first user gets admin role)
echo 3. Log in at http://localhost:3000/login
echo 4. Access admin panel at http://localhost:3000/admin
echo.

echo 🎉 DEPLOYMENT PROCESS COMPLETE!
echo ===============================
echo Your application will be available at http://localhost:3000
echo Remember to create your admin account as the first user!
echo.

pause