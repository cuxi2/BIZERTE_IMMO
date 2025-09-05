@echo off
cls
title MEFTAHI IMMO - Supabase RLS Fix
color 0A

echo =====================================================
echo MEFTAHI IMMO - SUPABASE EXPERT SOLUTION
echo =====================================================
echo Fixing "infinite recursion detected in policy for relation 'profiles'"
echo.

echo This script will:
echo 1. Disable RLS temporarily
echo 2. Drop problematic recursive policies
echo 3. Create new non-recursive policies
echo 4. Re-enable RLS with fixed policies
echo.

echo Press any key to continue...
pause >nul

echo.
echo Applying Supabase RLS fix...
echo.

cd /d D:\BIZERTA_IMMO
node apply-supabase-fix.js

echo.
echo Script execution completed.
echo.
echo If successful, you can now log in at http://localhost:3001/login
echo.
echo Press any key to exit...
pause >nul