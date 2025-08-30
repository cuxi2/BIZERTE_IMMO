# Deployment Guide - MEFTAHI IMMO

## 🚀 Deploying to Vercel

### Prerequisites
- GitHub account
- Vercel account
- Supabase project set up

### Step 1: Prepare Your Repository
1. Ensure all code is committed to your GitHub repository
2. Make sure `.env.local` is in `.gitignore` (it should be)
3. Verify `vercel.json` configuration

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub account
4. Select the MEFTAHI_IMMO repository

### Step 3: Configure Environment Variables
In Vercel dashboard, add these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE=your-service-role-key
NEXT_PUBLIC_SITE_NAME=MEFTAHI IMMO
COMPANY_CITY=Bizerte
COMPANY_PHONE=+216XXXXXXXX
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your site will be live at `https://your-project.vercel.app`

## 🗄️ Supabase Configuration

### Database Setup
1. Run the SQL schema from `supabase-schema.sql`
2. Create storage bucket `listings-media`
3. Set up RLS policies
4. Create admin user profile

### Storage Configuration
1. Go to Storage in Supabase dashboard
2. Create bucket: `listings-media`
3. Make it public
4. Set up policies for admin upload

### Authentication
1. Configure authentication providers
2. Set up email templates
3. Configure redirect URLs for production

## 🔒 Security Checklist

- [ ] RLS enabled on all tables
- [ ] Environment variables secured
- [ ] Admin access restricted
- [ ] Storage policies configured
- [ ] CORS settings verified

## 📊 Post-Deployment

### Testing
1. Test all public pages
2. Verify admin login works
3. Test property creation/editing
4. Test booking system
5. Test media uploads

### Monitoring
1. Set up error tracking
2. Monitor performance
3. Set up analytics
4. Monitor database usage

### Backups
1. Set up database backups
2. Export media files regularly
3. Document recovery procedures

## 🔄 Updates and Maintenance

### Code Updates
1. Push to main branch
2. Vercel auto-deploys
3. Monitor deployment logs
4. Test after deployment

### Database Updates
1. Test migrations in staging
2. Run during low-traffic hours
3. Backup before changes
4. Monitor after changes

## 🆘 Troubleshooting

### Common Issues
- **Build fails**: Check TypeScript errors, missing dependencies
- **Environment variables**: Ensure all required vars are set
- **Database connection**: Verify Supabase URL and keys
- **Authentication**: Check redirect URLs and providers

### Logs and Debugging
- Vercel function logs
- Browser console errors
- Supabase logs
- Performance monitoring

---

For technical support, contact the development team.