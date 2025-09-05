@echo off
cls
title MEFTAHI IMMO - New Database Setup
color 0A

echo =====================================================
echo MEFTAHI IMMO - NEW DATABASE INITIALIZATION
echo =====================================================
echo.
echo Using your new Supabase project:
echo URL: https://pvfzwnieerksnfusyidy.supabase.co
echo.

echo This script will:
echo 1. Initialize your database with the correct schema
echo 2. Set up all tables and relationships
echo 3. Configure non-recursive RLS policies
echo 4. Create automatic profile functions
echo.

echo Press any key to continue...
pause >nul

echo.
echo Initializing database...
echo.

cd /d D:\BIZERTA_IMMO
node init-new-database.js

echo.
echo Database initialization completed!
echo.

echo Next steps:
echo 1. Go to your Supabase dashboard
echo 2. Create a storage bucket named "listings-media"
echo 3. Set the bucket as PUBLIC
echo 4. Start your app with: npm run dev
echo 5. Register your first admin user at http://localhost:3000/register
echo.

echo Press any key to exit...
pause >nul