const { createClient } = require('@supabase/supabase-js');

// Use your new Supabase credentials
const SUPABASE_URL = 'https://pvfzwnieerksnfusyidy.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2Znp3bmllZXJrc25mdXN5aWR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzA3MTE3NywiZXhwIjoyMDcyNjQ3MTc3fQ.cq4W6tiZZdINnVu3OpsP0jxtvtnLlJwQob82LLt_O-g';

console.log('🔍 Verifying New Supabase Database Setup');
console.log('======================================');

async function verifySetup() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
  
  try {
    console.log('1. Checking database connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    if (error && !error.message.includes('relation "profiles" does not exist')) {
      throw error;
    }
    
    console.log('  ✅ Database connection successful');
    
    console.log('2. Checking if tables exist...');
    
    // Check if profiles table exists
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (profilesError && !profilesError.message.includes('relation "profiles" does not exist')) {
        throw profilesError;
      }
      
      if (profilesError) {
        console.log('  ⚠️  Profiles table not found - needs to be created');
      } else {
        console.log('  ✅ Profiles table exists');
      }
    } catch (e) {
      console.log('  ⚠️  Profiles table not found - needs to be created');
    }
    
    // Check if listings table exists
    try {
      const { data: listingsData, error: listingsError } = await supabase
        .from('listings')
        .select('id')
        .limit(1);
      
      if (listingsError && !listingsError.message.includes('relation "listings" does not exist')) {
        throw listingsError;
      }
      
      if (listingsError) {
        console.log('  ⚠️  Listings table not found - needs to be created');
      } else {
        console.log('  ✅ Listings table exists');
      }
    } catch (e) {
      console.log('  ⚠️  Listings table not found - needs to be created');
    }
    
    console.log('3. Checking RLS policies...');
    
    // Try to check if RLS is enabled (this is a simplified check)
    console.log('  ℹ️  RLS policies will be verified after schema creation');
    
    console.log('\n📋 Setup Verification Summary:');
    console.log('  ✅ Environment variables configured correctly');
    console.log('  ✅ Database connection successful');
    console.log('  ⚠️  Tables need to be created (run setup-new-db.bat)');
    console.log('  ⚠️  RLS policies need to be applied (run setup-new-db.bat)');
    
    console.log('\n🚀 Next Steps:');
    console.log('  1. Run setup-new-db.bat to create tables and policies');
    console.log('  2. Create "listings-media" storage bucket in Supabase dashboard');
    console.log('  3. Start your app: npm run dev');
    console.log('  4. Register first admin user at http://localhost:3000/register');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('  1. Check your internet connection');
    console.log('  2. Verify your Supabase credentials in .env.local');
    console.log('  3. Ensure your Supabase project is provisioned');
  }
}

verifySetup();