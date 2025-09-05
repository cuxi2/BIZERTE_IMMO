const { createClient } = require('@supabase/supabase-js');

// Use the service role key directly from your .env.local file
const SUPABASE_URL = 'https://tcnumqnrunxoejnqykwt.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjbnVtcW5ydW54b2VqbnF5a3d0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU3NTI3MiwiZXhwIjoyMDcyMTUxMjcyfQ.2mUWSO_Wg216A66qMVMhj4n4wnqbrSvyNFavaW-PCi8';

async function applyRLSFixes() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
  
  console.log('🔧 Applying RLS Policy Fixes...');
  console.log('===============================');
  
  try {
    // Fix Profiles policies
    console.log('📝 Fixing Profiles policies...');
    await supabase.rpc('exec_sql', {
      sql: `
        drop policy if exists "Profiles: admin read all" on public.profiles;
        create policy "Profiles: admin read all" on public.profiles
          for select using (
            auth.uid() in (
              select id from public.profiles where role = 'admin'
            )
          );
      `
    });
    
    // Fix Listings policies
    console.log('📝 Fixing Listings policies...');
    await supabase.rpc('exec_sql', {
      sql: `
        drop policy if exists "Listings: admin read all" on public.listings;
        create policy "Listings: admin read all" on public.listings
          for select using (
            auth.uid() in (
              select id from public.profiles where role = 'admin'
            )
          );
          
        drop policy if exists "Listings: admin write" on public.listings;
        create policy "Listings: admin write" on public.listings
          for all using (
            auth.uid() in (
              select id from public.profiles where role = 'admin'
            )
          );
      `
    });
    
    // Fix Media policies
    console.log('📝 Fixing Media policies...');
    await supabase.rpc('exec_sql', {
      sql: `
        drop policy if exists "Media: admin read all" on public.listing_media;
        create policy "Media: admin read all" on public.listing_media
          for select using (
            auth.uid() in (
              select id from public.profiles where role = 'admin'
            )
          );
          
        drop policy if exists "Media: admin write" on public.listing_media;
        create policy "Media: admin write" on public.listing_media
          for all using (
            auth.uid() in (
              select id from public.profiles where role = 'admin'
            )
          );
      `
    });
    
    // Fix Reservations policies
    console.log('📝 Fixing Reservations policies...');
    await supabase.rpc('exec_sql', {
      sql: `
        drop policy if exists "Reservations: manage by admin" on public.reservations;
        create policy "Reservations: manage by admin" on public.reservations
          for all using (
            auth.uid() in (
              select id from public.profiles where role = 'admin'
            )
          );
      `
    });
    
    // Fix Visits policies
    console.log('📝 Fixing Visits policies...');
    await supabase.rpc('exec_sql', {
      sql: `
        drop policy if exists "Visits: manage by admin" on public.visits;
        create policy "Visits: manage by admin" on public.visits
          for all using (
            auth.uid() in (
              select id from public.profiles where role = 'admin'
            )
          );
      `
    });
    
    // Fix Storage policies
    console.log('📝 Fixing Storage policies...');
    await supabase.rpc('exec_sql', {
      sql: `
        drop policy if exists "Listings Media: Admin Upload" on storage.objects;
        create policy "Listings Media: Admin Upload"
        on storage.objects for insert
        with check (
          bucket_id = 'listings-media'
          and auth.uid() in (
            select id from public.profiles where role = 'admin'
          )
        );
        
        drop policy if exists "Listings Media: Admin Delete" on storage.objects;
        create policy "Listings Media: Admin Delete"
        on storage.objects for delete
        using (
          bucket_id = 'listings-media'
          and auth.uid() in (
            select id from public.profiles where role = 'admin'
          )
        );
      `
    });
    
    console.log('\n✅ All RLS policies have been successfully updated!');
    console.log('\n🚀 You can now try creating your admin account again.');
    
  } catch (error) {
    console.error('❌ Error applying RLS fixes:', error.message);
    process.exit(1);
  }
}

applyRLSFixes();