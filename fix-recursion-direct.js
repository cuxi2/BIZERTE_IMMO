const { createClient } = require('@supabase/supabase-js');

// Use the service role key directly from your .env.local file
const SUPABASE_URL = 'https://tcnumqnrunxoejnqykwt.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjbnVtcW5ydW54b2VqbnF5a3d0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU3NTI3MiwiZXhwIjoyMDcyMTUxMjcyfQ.2mUWSO_Wg216A66qMVMhj4n4wnqbrSvyNFavaW-PCi8';

async function fixRecursionError() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
  
  console.log('🔧 Fixing Infinite Recursion Error...');
  console.log('====================================');
  
  try {
    // Step 1: Disable RLS on profiles table
    console.log('1. Disabling RLS on profiles table...');
    await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;' 
    });
    
    // Step 2: Drop the problematic policy
    console.log('2. Dropping problematic policy...');
    await supabase.rpc('exec_sql', { 
      sql: 'DROP POLICY IF EXISTS "Profiles are viewable by admins." ON public.profiles;' 
    });
    
    // Step 3: Create new non-recursive policy
    console.log('3. Creating new non-recursive policy...');
    await supabase.rpc('exec_sql', { 
      sql: `CREATE POLICY "Profiles are viewable by admins." 
            ON public.profiles FOR SELECT 
            USING (
              EXISTS (
                SELECT 1 
                FROM public.profiles p 
                WHERE p.id = auth.uid() 
                AND p.role = 'admin'
              )
            );` 
    });
    
    // Step 4: Re-enable RLS
    console.log('4. Re-enabling RLS on profiles table...');
    await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;' 
    });
    
    console.log('\n✅ Recursion error has been fixed successfully!');
    console.log('\n🚀 You can now try logging in at http://localhost:3001/login');
    
  } catch (error) {
    console.error('❌ Error fixing recursion:', error.message);
    
    // Provide manual instructions
    console.log('\n🔧 Manual Fix Instructions:');
    console.log('1. Go to your Supabase dashboard:');
    console.log('   https://app.supabase.com/project/tcnumqnrunxoejnqykwt');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run this SQL script:');
    console.log(`
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles are viewable by admins." ON public.profiles;
CREATE POLICY "Profiles are viewable by admins." 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin'
  )
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;`);
    console.log('4. Try logging in again at http://localhost:3001/login');
    
    process.exit(1);
  }
}

fixRecursionError();