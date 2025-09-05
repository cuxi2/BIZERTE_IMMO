@echo off
cls
title MEFTAHI IMMO - Production Deployment
color 0A

echo =====================================================
echo MEFTAHI IMMO - PRODUCTION DEPLOYMENT
echo =====================================================
echo.
echo Project: MEFTAHI IMMO (Real Estate Platform)
echo Location: d:\BIZERTA_IMMO
echo.

echo PRODUCTION DEPLOYMENT OPTIONS:
echo ============================
echo 1. Self-hosted Deployment
echo 2. Vercel Deployment
echo 3. Docker Deployment (Coming Soon)
echo.

echo OPTION 1: Self-hosted Deployment
echo =============================
echo Prerequisites:
echo - Node.js 18+ installed
echo - Server with public IP
echo - Domain name (optional)
echo.
echo Steps:
echo 1. Build the application:
echo    cd d:\BIZERTA_IMMO
echo    npm run build
echo.
echo 2. Start production server:
echo    npm start
echo.
echo 3. Set up reverse proxy (nginx/apache)
echo 4. Configure SSL certificate
echo.

echo OPTION 2: Vercel Deployment
echo ========================
echo Prerequisites:
echo - GitHub account
echo - Vercel account
echo.
echo Steps:
echo 1. Push code to GitHub:
echo    git init
echo    git add .
echo    git commit -m "Initial commit"
echo    git remote add origin https://github.com/cuxi2/BIZERTE_IMMO.git
echo    git push -u origin main
echo.
echo 2. Deploy to Vercel:
echo    - Go to https://vercel.com
echo    - Connect your GitHub repository
echo    - Set environment variables:
echo      NEXT_PUBLIC_SUPABASE_URL=https://pvfzwnieerksnfusyidy.supabase.co
echo      NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2Znp3bmllZXJrc25mdXN5aWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzExNzcsImV4cCI6MjA3MjY0NzE3N30.zVaKCGZUiFJHf3H3SqEJrA6CKcwpgU2MW0E5B7qxzmA
echo      SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2Znp3bmllZXJrc25mdXN5aWR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzA3MTE3NywiZXhwIjoyMDcyNjQ3MTc3fQ.cq4W6tiZZdINnVu3OpsP0jxtvtnLlJwQob82LLt_O-g
echo      NEXT_PUBLIC_SITE_NAME=MEFTAHI IMMO
echo      COMPANY_CITY=Bizerte
echo      COMPANY_PHONE=+216XXXXXXXX
echo    - Deploy!
echo.

echo Press any key to exit...
pause >nul