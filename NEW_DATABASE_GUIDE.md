# MEFTAHI IMMO - New Supabase Database Setup Guide

## Why Create a New Database?

The current database has RLS (Row Level Security) policies with recursion issues that are difficult to resolve. Creating a fresh database with properly configured non-recursive policies is the cleanest solution.

## Step-by-Step Setup Instructions

### 1. Create New Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: `MEFTAHI_IMMO_NEW`
   - **Database Password**: Create a strong password
   - **Region**: Choose the region closest to Tunisia for best performance
4. Click **"Create Project"** (this takes 2-3 minutes)

### 2. Get API Credentials

1. After project creation, go to **Project Settings > API**
2. Copy these values:
   - **Project URL** (starts with https://)
   - **anon key** (for client-side usage)
   - **service_role key** (for server-side operations)

### 3. Update Environment Variables

Update your `d:\BIZERTA_IMMO\.env.local` file with the new credentials:

```env
# Supabase Configuration (NEW DATABASE)
NEXT_PUBLIC_SUPABASE_URL=your-new-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-new-anon-key-here
SUPABASE_SERVICE_ROLE=your-new-service-role-key-here

# Site Configuration
NEXT_PUBLIC_SITE_NAME=MEFTAHI IMMO
COMPANY_CITY=Bizerte
COMPANY_PHONE=+216XXXXXXXX
```

### 4. Apply Database Schema

1. In your new Supabase project, go to **SQL Editor**
2. Copy the entire content from `d:\BIZERTA_IMMO\NEW_DATABASE_SETUP.sql`
3. Paste it into the SQL Editor
4. Click **"Run"** to execute the script

This will create:
- All necessary tables with proper relationships
- Non-recursive RLS policies (no more infinite recursion errors)
- Indexes for better performance
- Automatic profile creation function and trigger

### 5. Set Up Storage

1. Go to **Storage** in your Supabase dashboard
2. Click **"Create Bucket"**
3. Name it `listings-media`
4. Set it as **Public** (important for image display)
5. Click **"Create Bucket"**

### 6. Test the Setup

1. Start your Next.js application:
   ```bash
   cd d:\BIZERTA_IMMO
   npm run dev
   ```

2. Open your browser to http://localhost:3000

3. Go to the registration page and create your first admin account:
   - The first user automatically gets the 'admin' role
   - Subsequent users get 'client' role by default

### 7. Verify Everything Works

1. **Login as Admin**: Use your new admin credentials
2. **Access Admin Panel**: You should be able to access /admin without recursion errors
3. **Create Listings**: Test creating property listings
4. **Upload Media**: Test uploading images to the listings-media bucket

## Benefits of the New Database

✅ **No RLS Recursion Issues**: All policies are non-recursive
✅ **Clean Schema**: Fresh database without legacy issues
✅ **Better Performance**: Proper indexes and optimized queries
✅ **Automatic Profile Creation**: No manual profile management needed
✅ **Proper Role Management**: Admin/client roles work correctly

## Troubleshooting

### If you can't access the admin panel:
1. Check that you registered as the FIRST user (gets admin role automatically)
2. Verify your profile has role='admin' in the profiles table
3. Check browser console for any JavaScript errors

### If images don't load:
1. Verify the `listings-media` bucket exists and is public
2. Check that media URLs are correctly stored in the listing_media table

### If registration fails:
1. Ensure your .env.local has the correct new Supabase credentials
2. Check that the handle_new_user function was created properly

## Next Steps

After successful setup:
1. Test all functionality thoroughly
2. Create sample listings and reservations
3. Verify admin and client access levels
4. Backup your new database regularly

This fresh start will eliminate all the recursion issues you've been experiencing!