@echo off
cls
title MEFTAHI IMMO - Fresh Start
color 0A

echo =====================================================
echo MEFTAHI IMMO - FRESH DATABASE SETUP
echo =====================================================
echo.
echo You're getting this error because of RLS recursion issues:
echo "Une erreur est survenue lors de la vérification du profil: infinite recursion detected in policy for relation 'profiles'"
echo.
echo The BEST solution is to create a new, clean Supabase database.
echo.

echo This script will:
echo 1. Open the Supabase dashboard for creating a new project
echo 2. Show you the database setup instructions
echo 3. Open the SQL script for the new database schema
echo.

echo Press any key to continue...
pause >nul

echo.
echo 1. Opening Supabase dashboard to create new project...
start https://app.supabase.com/

echo.
echo 2. Opening the new database setup guide...
start notepad d:\BIZERTA_IMMO\NEW_DATABASE_GUIDE.md

echo.
echo 3. Opening the SQL script for the new database...
start notepad d:\BIZERTA_IMMO\NEW_DATABASE_SETUP.sql

echo.
echo Instructions:
echo 1. Create a new Supabase project
echo 2. Update your .env.local with new credentials
echo 3. Run the SQL script in your new database
echo 4. Create the listings-media storage bucket
echo 5. Start your app with: npm run dev
echo.

echo Press any key to exit...
pause >nul