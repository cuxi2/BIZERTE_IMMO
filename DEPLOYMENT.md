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
1. Create a new project on [Supabase](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase-schema.sql`
3. Create a storage bucket named `listings-media` (public)
4. Copy your project URL and keys

### 3. Environment Variables
Set these environment variables on your hosting platform:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE=your-supabase-service-role-key
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
After deployment:
1. Sign up for an account through the website
2. In Supabase dashboard, go to Authentication > Users
3. Copy the user UUID
4. In SQL Editor, run:
```sql
INSERT INTO public.profiles (id, full_name, phone, role) 
VALUES ('your-user-uuid', 'Admin Name', '+216XXXXXXXX', 'admin');
```

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

## Support
For support or questions about MEFTAHI IMMO:
- 📧 Email: contact@meftahi-immo.tn
- 📞 Phone: +216 XX XXX XXX
- 📍 Address: Bizerte, Tunisia