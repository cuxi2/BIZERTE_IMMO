@echo off
title Fix Recursion Error - MEFTAHI IMMO
color 0A

echo ========================================
echo MEFTAHI IMMO - Recursion Error Fix Tool
echo ========================================
echo.

echo This tool will fix the "infinite recursion detected in policy for relation 'profiles'" error.
echo.

echo Instructions:
echo 1. This will open your Supabase dashboard
echo 2. You need to manually run the SQL fix script
echo 3. After running the script, you can log in to your app
echo.

pause

echo Opening Supabase dashboard...
start https://app.supabase.com/project/tcnumqnrunxoejnqykwt

echo.
echo Please follow these steps in the Supabase dashboard:
echo.
echo 1. Go to SQL Editor
echo 2. Copy and paste the following script:
echo.
echo === SQL SCRIPT TO FIX RECURSION ERROR ===
echo ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
echo DROP POLICY IF EXISTS "Profiles are viewable by admins." ON public.profiles;
echo CREATE POLICY "Profiles are viewable by admins." ON public.profiles FOR SELECT USING ^(
echo   EXISTS ^(
echo     SELECT 1 FROM public.profiles p WHERE p.id = auth.uid^() AND p.role = 'admin'
echo   ^)
echo ^);
echo ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
echo === END OF SCRIPT ===
echo.
echo 3. Click "Run" to execute the script
echo 4. After successful execution, you can log in at http://localhost:3001/login
echo.

pause