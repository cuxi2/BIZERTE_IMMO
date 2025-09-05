# Deployment Guide for MEFTAHI IMMO

## Prerequisites
1. Node.js 18+ installed
2. A Supabase account
3. A hosting platform (Vercel, Netlify, etc.)

## Deployment Steps

### 1. Prepare the Application
```bash
# Install dependencies
npm install

# Test the build
npm run build
```

### 2. Set Up Supabase
1. Create a new project on [Supabase](https://supabase.com) or use your existing project
2. **NEW**: Run the automated database setup script to create tables and policies:
   ```bash
   # Windows
   setup-new-db.bat
   
   # Or manually
   node init-new-database.js
   ```
3. Create a storage bucket named `listings-media` (public)
4. Copy your project URL and keys

### 3. Environment Variables
Set these environment variables on your hosting platform:

```env
NEXT_PUBLIC_SUPABASE_URL=https://pvfzwnieerksnfusyidy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2Znp3bmllZXJrc25mdXN5aWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzExNzcsImV4cCI6MjA3MjY0NzE3N30.zVaKCGZUiFJHf3H3SqEJrA6CKcwpgU2MW0E5B7qxzmA
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2Znp3bmllZXJrc25mdXN5aWR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzA3MTE3NywiZXhwIjoyMDcyNjQ3MTc3fQ.cq4W6tiZZdINnVu3OpsP0jxtvtnLlJwQob82LLt_O-g
NEXT_PUBLIC_SITE_NAME=MEFTAHI IMMO
COMPANY_CITY=Bizerte
COMPANY_PHONE=+216XXXXXXXX
```

### 4. Deploy to Vercel
1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Set the environment variables in Vercel dashboard
4. Deploy!

### 5. Create Admin User
After deployment, the first user to register will automatically get admin privileges:

1. Visit your deployed application
2. Navigate to `/register`
3. Create your account (first user gets admin role automatically)
4. Log in at `/login`
5. Access admin panel at `/admin`

## Automated Deployment Scripts

### Development Deployment
Run the complete setup locally:
```bash
# Windows
simple-deploy.bat

# Or step by step:
setup-new-db.bat
npm run dev
```

### Production Deployment
For production deployment, see `deploy-production.bat` for options:
- Self-hosted deployment
- Vercel deployment
- Docker deployment (coming soon)

## Troubleshooting

### Build Issues
If you encounter build issues:
1. Check that all environment variables are set correctly
2. Ensure the Supabase schema is properly applied
3. Check for TypeScript errors with `npm run type-check`

### Runtime Issues
If the application doesn't work after deployment:
1. Check browser console for errors
2. Verify Supabase connection in the Network tab
3. Ensure all environment variables are correctly set
4. Verify database tables were created with `setup-new-db.bat`

### Database Issues
If you encounter "relation does not exist" errors:
1. Run `setup-new-db.bat` to create database tables
2. Check that the SQL script executed successfully
3. Verify your Supabase credentials in `.env.local`

## Support
For support or questions about MEFTAHI IMMO:
- 📧 Email: contact@meftahi-immo.tn
- 📞 Phone: +216 XX XXX XXX
- 📍 Address: Bizerte, Tunisia