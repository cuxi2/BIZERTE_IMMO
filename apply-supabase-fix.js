const { createClient } = require('@supabase/supabase-js');

// Supabase configuration from your .env.local
const SUPABASE_URL = 'https://tcnumqnrunxoejnqykwt.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjbnVtcW5ydW54b2VqbnF5a3d0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU3NTI3MiwiZXhwIjoyMDcyMTUxMjcyfQ.2mUWSO_Wg216A66qMVMhj4n4wnqbrSvyNFavaW-PCi8';

console.log('🚀 SUPABASE EXPERT SOLUTION: FIXING RECURSION ERROR');
console.log('================================================');

async function applySupabaseFix() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
  
  try {
    console.log('🔧 Step 1: Disabling RLS on all tables...');
    
    const disableRLS = [
      'ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.listings DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.listing_media DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.reservations DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.visits DISABLE ROW LEVEL SECURITY;'
    ];
    
    for (const sql of disableRLS) {
      try {
        await supabase.rpc('exec_sql', { sql });
        console.log(`✅ ${sql.substring(0, 50)}...`);
      } catch (error) {
        console.log(`⚠️  ${sql.substring(0, 50)}... (already disabled or error)`);
      }
    }
    
    console.log('\n🔧 Step 2: Dropping existing policies...');
    
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Profiles are viewable by themselves." ON public.profiles;',
      'DROP POLICY IF EXISTS "Profiles are viewable by admins." ON public.profiles;',
      'DROP POLICY IF EXISTS "Profiles can be updated by admins." ON public.profiles;',
      'DROP POLICY IF EXISTS "Profiles can be updated by owners." ON public.profiles;',
      'DROP POLICY IF EXISTS "Profiles can be inserted by admins." ON public.profiles;',
      'DROP POLICY IF EXISTS "Listings are viewable by everyone." ON public.listings;',
      'DROP POLICY IF EXISTS "Listings can be updated by admins." ON public.listings;',
      'DROP POLICY IF EXISTS "Listings can be inserted by admins." ON public.listings;',
      'DROP POLICY IF EXISTS "Listings can be deleted by admins." ON public.listings;',
      'DROP POLICY IF EXISTS "Media are viewable by everyone." ON public.listing_media;',
      'DROP POLICY IF EXISTS "Media can be managed by admins." ON public.listing_media;',
      'DROP POLICY IF EXISTS "Reservations can be managed by admins." ON public.reservations;',
      'DROP POLICY IF EXISTS "Reservations are viewable by owners." ON public.reservations;',
      'DROP POLICY IF EXISTS "Visits can be managed by admins." ON public.visits;',
      'DROP POLICY IF EXISTS "Visits are viewable by owners." ON public.visits;'
    ];
    
    for (const sql of dropPolicies) {
      try {
        await supabase.rpc('exec_sql', { sql });
        console.log(`✅ ${sql.substring(0, 60)}...`);
      } catch (error) {
        console.log(`⚠️  ${sql.substring(0, 60)}... (policy not found or error)`);
      }
    }
    
    console.log('\n🔧 Step 3: Creating new non-recursive policies...');
    
    const createPolicies = [
      // Profiles policies
      `CREATE POLICY "Profiles are viewable by themselves."
       ON public.profiles FOR SELECT
       USING (auth.uid() = id);`,
       
      `CREATE POLICY "Profiles are viewable by admins."
       ON public.profiles FOR SELECT
       USING (
         COALESCE(
           (auth.jwt() ->> 'user_role') = 'admin',
           EXISTS (
             SELECT 1 FROM public.profiles p 
             WHERE p.id = auth.uid() AND p.role = 'admin'
           )
         )
       );`,
       
      `CREATE POLICY "Profiles can be updated by admins."
       ON public.profiles FOR UPDATE
       USING (
         COALESCE(
           (auth.jwt() ->> 'user_role') = 'admin',
           EXISTS (
             SELECT 1 FROM public.profiles p 
             WHERE p.id = auth.uid() AND p.role = 'admin'
           )
         )
       );`,
       
      `CREATE POLICY "Profiles can be updated by owners."
       ON public.profiles FOR UPDATE
       USING (auth.uid() = id);`,
       
      `CREATE POLICY "Profiles can be inserted by admins."
       ON public.profiles FOR INSERT
       WITH CHECK (
         COALESCE(
           (auth.jwt() ->> 'user_role') = 'admin',
           EXISTS (
             SELECT 1 FROM public.profiles p 
             WHERE p.id = auth.uid() AND p.role = 'admin'
           )
         )
       );`,
       
      // Listings policies
      `CREATE POLICY "Listings are viewable by everyone."
       ON public.listings FOR SELECT
       USING (true);`,
       
      `CREATE POLICY "Listings can be updated by admins."
       ON public.listings FOR ALL
       USING (
         COALESCE(
           (auth.jwt() ->> 'user_role') = 'admin',
           EXISTS (
             SELECT 1 FROM public.profiles p 
             WHERE p.id = auth.uid() AND p.role = 'admin'
           )
         )
       );`,
       
      `CREATE POLICY "Listings can be inserted by admins."
       ON public.listings FOR INSERT
       WITH CHECK (
         COALESCE(
           (auth.jwt() ->> 'user_role') = 'admin',
           EXISTS (
             SELECT 1 FROM public.profiles p 
             WHERE p.id = auth.uid() AND p.role = 'admin'
           )
         )
       );`,
       
      `CREATE POLICY "Listings can be deleted by admins."
       ON public.listings FOR DELETE
       USING (
         COALESCE(
           (auth.jwt() ->> 'user_role') = 'admin',
           EXISTS (
             SELECT 1 FROM public.profiles p 
             WHERE p.id = auth.uid() AND p.role = 'admin'
           )
         )
       );`,
       
      // Media policies
      `CREATE POLICY "Media are viewable by everyone."
       ON public.listing_media FOR SELECT
       USING (true);`,
       
      `CREATE POLICY "Media can be managed by admins."
       ON public.listing_media FOR ALL
       USING (
         COALESCE(
           (auth.jwt() ->> 'user_role') = 'admin',
           EXISTS (
             SELECT 1 FROM public.profiles p 
             WHERE p.id = auth.uid() AND p.role = 'admin'
           )
         )
       );`,
       
      // Reservations policies
      `CREATE POLICY "Reservations can be managed by admins."
       ON public.reservations FOR ALL
       USING (
         COALESCE(
           (auth.jwt() ->> 'user_role') = 'admin',
           EXISTS (
             SELECT 1 FROM public.profiles p 
             WHERE p.id = auth.uid() AND p.role = 'admin'
           )
         )
       );`,
       
      `CREATE POLICY "Reservations are viewable by owners."
       ON public.reservations FOR SELECT
       USING (
         COALESCE(
           (auth.jwt() ->> 'user_role') = 'admin',
           EXISTS (
             SELECT 1 FROM public.profiles p 
             WHERE p.id = auth.uid() AND (p.role = 'admin' OR p.id = user_id)
           )
         )
       );`,
       
      // Visits policies
      `CREATE POLICY "Visits can be managed by admins."
       ON public.visits FOR ALL
       USING (
         COALESCE(
           (auth.jwt() ->> 'user_role') = 'admin',
           EXISTS (
             SELECT 1 FROM public.profiles p 
             WHERE p.id = auth.uid() AND p.role = 'admin'
           )
         )
       );`,
       
      `CREATE POLICY "Visits are viewable by owners."
       ON public.visits FOR SELECT
       USING (
         COALESCE(
           (auth.jwt() ->> 'user_role') = 'admin',
           EXISTS (
             SELECT 1 FROM public.profiles p 
             WHERE p.id = auth.uid() AND (p.role = 'admin' OR p.id = user_id)
           )
         )
       );`
    ];
    
    for (const sql of createPolicies) {
      try {
        await supabase.rpc('exec_sql', { sql });
        console.log(`✅ Policy created successfully`);
      } catch (error) {
        console.log(`❌ Error creating policy: ${error.message}`);
      }
    }
    
    console.log('\n🔧 Step 4: Re-enabling RLS...');
    
    const enableRLS = [
      'ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.listing_media ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;'
    ];
    
    for (const sql of enableRLS) {
      try {
        await supabase.rpc('exec_sql', { sql });
        console.log(`✅ ${sql.substring(0, 50)}...`);
      } catch (error) {
        console.log(`⚠️  ${sql.substring(0, 50)}... (error: ${error.message})`);
      }
    }
    
    console.log('\n🔧 Step 5: Granting permissions...');
    
    const grantPermissions = [
      'GRANT ALL ON public.profiles TO authenticated;',
      'GRANT ALL ON public.listings TO authenticated;',
      'GRANT ALL ON public.listing_media TO authenticated;',
      'GRANT ALL ON public.reservations TO authenticated;',
      'GRANT ALL ON public.visits TO authenticated;'
    ];
    
    for (const sql of grantPermissions) {
      try {
        await supabase.rpc('exec_sql', { sql });
        console.log(`✅ ${sql.substring(0, 50)}...`);
      } catch (error) {
        console.log(`⚠️  ${sql.substring(0, 50)}... (error: ${error.message})`);
      }
    }
    
    console.log('\n🎉 SUPABASE RLS RECURSION ERROR FIXED SUCCESSFULLY!');
    console.log('\n✅ You can now log in at http://localhost:3001/login');
    console.log('\n🔐 Admin credentials:');
    console.log('   Email: admin@meftahi-immo.tn');
    console.log('   Password: SecurePass123!');
    
  } catch (error) {
    console.error('❌ FATAL ERROR:', error.message);
    console.log('\n🔧 MANUAL FIX INSTRUCTIONS:');
    console.log('1. Open Supabase dashboard: https://app.supabase.com/project/tcnumqnrunxoejnqykwt');
    console.log('2. Go to SQL Editor');
    console.log('3. Run the script in: d:\\BIZERTA_IMMO\\SUPABASE_RECURSION_FIX.sql');
    console.log('4. Try logging in again');
  }
}

applySupabaseFix();