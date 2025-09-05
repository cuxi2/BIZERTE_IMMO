# MEFTAHI IMMO - COMPLETE NEW DATABASE SETUP GUIDE

## Your New Supabase Project

✅ **Project URL**: https://pvfzwnieerksnfusyidy.supabase.co
✅ **Environment Variables**: Already configured in `.env.local`

## Step-by-Step Setup Instructions

### 1. Initialize Database Schema

Run the database setup script:
```
cd d:\BIZERTA_IMMO
setup-new-db.bat
```

This will:
- Create all necessary tables (profiles, listings, listing_media, reservations, visits)
- Set up proper relationships between tables
- Configure non-recursive RLS policies (no more infinite recursion errors)
- Create automatic profile creation function

### 2. Create Storage Bucket

1. Go to your [Supabase Dashboard](https://app.supabase.com/project/pvfzwnieerksnfusyidy)
2. Navigate to **Storage** in the left sidebar
3. Click **"Create Bucket"**
4. Name it `listings-media`
5. Set it as **Public**
6. Click **"Create Bucket"**

### 3. Start Your Application

```
cd d:\BIZERTA_IMMO
npm run dev
```

Your app will be available at http://localhost:3000

### 4. Create Your First Admin Account

1. Visit http://localhost:3000/register
2. Fill in your admin details
3. The first user automatically gets the 'admin' role
4. Log in at http://localhost:3000/login

## What's Included in the New Setup

### Database Tables
- **profiles**: User profiles with role management (admin, agent, client)
- **listings**: Property listings with all details
- **listing_media**: Images and videos for listings
- **reservations**: Booking system for rentals
- **visits**: Scheduled property viewings

### Security Features
- **Non-recursive RLS policies**: No more infinite recursion errors
- **Automatic profile creation**: First user = admin, others = client
- **Proper role-based access control**: Admins can manage everything
- **Secure authentication**: Built-in Supabase Auth

### Performance Optimizations
- **Proper indexing**: Fast queries on all important fields
- **Clean schema design**: Optimized table relationships
- **Efficient policies**: No performance overhead from recursion

## Troubleshooting Common Issues

### If you see "relation does not exist" errors:
1. Make sure you ran `setup-new-db.bat`
2. Check that all SQL statements executed successfully

### If images don't load:
1. Verify the `listings-media` bucket exists
2. Ensure the bucket is set to **Public**
3. Check that media URLs are correctly formatted

### If registration fails:
1. Confirm your Supabase credentials in `.env.local`
2. Check that the database tables were created
3. Verify the `handle_new_user` function exists

## Verification Commands

To verify your setup is working:

```bash
# Test database connection and tables
node verify-setup.js

# Check environment variables
echo NEXT_PUBLIC_SUPABASE_URL=%NEXT_PUBLIC_SUPABASE_URL%
```

## Next Steps After Setup

1. **Test all functionality**:
   - Create a listing
   - Upload images
   - Make a reservation
   - Schedule a visit

2. **Customize the platform**:
   - Update company information in `.env.local`
   - Modify branding in the header/footer
   - Add your own property listings

3. **Backup your database**:
   - Regular backups through Supabase dashboard
   - Export data periodically

## Benefits of This New Setup

✅ **No RLS recursion issues** - Clean, non-recursive policies
✅ **Automatic admin setup** - First user gets admin role automatically
✅ **Better performance** - Proper indexing and optimized queries
✅ **Cleaner codebase** - No legacy policy issues
✅ **Easier maintenance** - Well-structured schema and policies

This setup completely eliminates the "infinite recursion detected in policy for relation 'profiles'" error you were experiencing!