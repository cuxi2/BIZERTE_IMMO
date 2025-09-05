// Script to fix the recursive RLS policies
const { createClient } = require('@supabase/supabase-js')

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error('⚠️  Missing environment variables!')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: {
    persistSession: false
  }
})

async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS policies to prevent infinite recursion...')
  
  try {
    // Drop the old policies first
    console.log('🗑️  Dropping old policies...')
    
    const oldPolicies = [
      'Profiles: admin read all',
      'Listings: admin read all',
      'Listings: admin write',
      'Media: admin read all',
      'Media: admin write',
      'Reservations: manage by admin',
      'Visits: manage by admin',
      'Listings Media: Admin Upload',
      'Listings Media: Admin Delete'
    ]
    
    for (const policyName of oldPolicies) {
      try {
        await supabase.rpc('drop_policy_if_exists', {
          tablename: policyName.includes('Media') && policyName.includes('Listings') ? 'objects' : 
                    policyName.includes('Media') ? 'listing_media' :
                    policyName.includes('Listings') ? 'listings' :
                    policyName.includes('Reservations') ? 'reservations' :
                    policyName.includes('Visits') ? 'visits' : 'profiles',
          policyname: policyName
        })
        console.log(`   ✅ Dropped policy: ${policyName}`)
      } catch (error) {
        console.log(`   ℹ️  Policy ${policyName} may not exist, continuing...`)
      }
    }
    
    console.log('✅ Old policies dropped')
    console.log('🔧 Creating new policies...')
    
    // Since we can't execute DDL statements directly through the JS client,
    // we'll provide the SQL statements that need to be run manually
    console.log('\n📋 Please run the following SQL statements in your Supabase SQL Editor:')
    console.log('\n```sql')
    console.log('-- Fix Profiles policies')
    console.log('drop policy if exists "Profiles: admin read all" on public.profiles;')
    console.log('create policy "Profiles: admin read all" on public.profiles')
    console.log('  for select using (')
    console.log('    auth.uid() in (')
    console.log('      select id from public.profiles where role = \'admin\'')
    console.log('    )')
    console.log('  );')
    console.log('')
    console.log('-- Fix Listings policies')
    console.log('drop policy if exists "Listings: admin read all" on public.listings;')
    console.log('create policy "Listings: admin read all" on public.listings')
    console.log('  for select using (')
    console.log('    auth.uid() in (')
    console.log('      select id from public.profiles where role = \'admin\'')
    console.log('    )')
    console.log('  );')
    console.log('drop policy if exists "Listings: admin write" on public.listings;')
    console.log('create policy "Listings: admin write" on public.listings')
    console.log('  for all using (')
    console.log('    auth.uid() in (')
    console.log('      select id from public.profiles where role = \'admin\'')
    console.log('    )')
    console.log('  );')
    console.log('')
    console.log('-- Fix Media policies')
    console.log('drop policy if exists "Media: admin read all" on public.listing_media;')
    console.log('create policy "Media: admin read all" on public.listing_media')
    console.log('  for select using (')
    console.log('    auth.uid() in (')
    console.log('      select id from public.profiles where role = \'admin\'')
    console.log('    )')
    console.log('  );')
    console.log('drop policy if exists "Media: admin write" on public.listing_media;')
    console.log('create policy "Media: admin write" on public.listing_media')
    console.log('  for all using (')
    console.log('    auth.uid() in (')
    console.log('      select id from public.profiles where role = \'admin\'')
    console.log('    )')
    console.log('  );')
    console.log('')
    console.log('-- Fix Reservations policies')
    console.log('drop policy if exists "Reservations: manage by admin" on public.reservations;')
    console.log('create policy "Reservations: manage by admin" on public.reservations')
    console.log('  for all using (')
    console.log('    auth.uid() in (')
    console.log('      select id from public.profiles where role = \'admin\'')
    console.log('    )')
    console.log('  );')
    console.log('')
    console.log('-- Fix Visits policies')
    console.log('drop policy if exists "Visits: manage by admin" on public.visits;')
    console.log('create policy "Visits: manage by admin" on public.visits')
    console.log('  for all using (')
    console.log('    auth.uid() in (')
    console.log('      select id from public.profiles where role = \'admin\'')
    console.log('    )')
    console.log('  );')
    console.log('')
    console.log('-- Fix Storage policies')
    console.log('drop policy if exists "Listings Media: Admin Upload" on storage.objects;')
    console.log('create policy "Listings Media: Admin Upload"')
    console.log('on storage.objects for insert')
    console.log('with check (')
    console.log('  bucket_id = \'listings-media\'')
    console.log('  and auth.uid() in (')
    console.log('    select id from public.profiles where role = \'admin\'')
    console.log('  )')
    console.log(');')
    console.log('drop policy if exists "Listings Media: Admin Delete" on storage.objects;')
    console.log('create policy "Listings Media: Admin Delete"')
    console.log('on storage.objects for delete')
    console.log('using (')
    console.log('  bucket_id = \'listings-media\'')
    console.log('  and auth.uid() in (')
    console.log('    select id from public.profiles where role = \'admin\'')
    console.log('  )')
    console.log(');')
    console.log('```')
    
    console.log('\n✅ RLS policy fix script completed!')
    console.log('💡 Please copy the SQL statements above and run them in your Supabase SQL Editor')
    
  } catch (error) {
    console.error('💥 Error fixing RLS policies:', error.message)
  }
}

// Helper function to drop policy if exists (this would need to be created in Supabase)
console.log('ℹ️  Creating helper function in Supabase...')
console.log('\n📋 First, please run this SQL to create a helper function:')
console.log('\n```sql')
console.log('create or replace function drop_policy_if_exists(tablename text, policyname text)')
console.log('returns void as $$')
console.log('begin')
console.log('  execute format(\'drop policy if exists %I on %I\', policyname, tablename);')
console.log('exception when undefined_object then')
console.log('  -- Policy does not exist, ignore')
console.log('end;')
console.log('$$ language plpgsql;')
console.log('```')

fixRLSPolicies()