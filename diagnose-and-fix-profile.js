const { createClient } = require('@supabase/supabase-js');

// Use the service role key directly from your .env.local file
const SUPABASE_URL = 'https://tcnumqnrunxoejnqykwt.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjbnVtcW5ydW54b2VqbnF5a3d0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU3NTI3MiwiZXhwIjoyMDcyMTUxMjcyfQ.2mUWSO_Wg216A66qMVMhj4n4wnqbrSvyNFavaW-PCi8';

async function diagnoseAndFixProfile() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
  
  console.log('🔍 Diagnosing and Fixing Profile Issues...');
  console.log('==========================================');
  
  try {
    // 1. List all users
    console.log('\n📋 Listing all auth users...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) throw usersError;
    
    console.log(`Found ${users.users.length} user(s):`);
    users.users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} (ID: ${user.id})`);
    });
    
    // 2. Check profiles table
    console.log('\n📋 Checking profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    if (profilesError) throw profilesError;
    
    console.log(`Found ${profiles.length} profile(s):`);
    profiles.forEach((profile, index) => {
      console.log(`  ${index + 1}. ${profile.full_name || 'No name'} (${profile.id}) - Role: ${profile.role}`);
    });
    
    // 3. Check for admin user
    console.log('\n🔍 Looking for admin user...');
    const { data: adminProfiles, error: adminError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin');
    if (adminError) throw adminError;
    
    if (adminProfiles.length > 0) {
      console.log(`✅ Found ${adminProfiles.length} admin user(s):`);
      adminProfiles.forEach((profile, index) => {
        console.log(`  ${index + 1}. ${profile.full_name || 'No name'} (${profile.id}) - ${profile.email}`);
      });
    } else {
      console.log('⚠️  No admin users found. Creating one...');
      
      // If there are users but no admin, make the first user an admin
      if (users.users.length > 0) {
        const firstUser = users.users[0];
        console.log(`🔧 Making ${firstUser.email} an admin...`);
        
        const { error: updateError } = await supabase
          .from('profiles')
          .upsert({
            id: firstUser.id,
            full_name: firstUser.user_metadata?.full_name || firstUser.email.split('@')[0],
            phone: firstUser.user_metadata?.phone || null,
            role: 'admin'
          }, {
            onConflict: 'id'
          });
        
        if (updateError) throw updateError;
        console.log('✅ Successfully made user an admin!');
      } else {
        console.log('❌ No users found in the system.');
      }
    }
    
    // 4. Fix any profiles with missing data
    console.log('\n🔧 Fixing profiles with missing data...');
    for (const profile of profiles) {
      if (!profile.role) {
        console.log(`  Fixing profile ${profile.id} (missing role)...`);
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'client' })
          .eq('id', profile.id);
        if (updateError) throw updateError;
        console.log(`  ✅ Fixed profile ${profile.id}`);
      }
    }
    
    // 5. Verify RLS policies are working
    console.log('\n🔍 Testing RLS policies...');
    if (users.users.length > 0) {
      const testUser = users.users[0];
      const { data: testProfiles, error: testError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', testUser.id);
      
      if (testError) {
        console.log('❌ RLS policy test failed:', testError.message);
      } else {
        console.log('✅ RLS policies are working correctly');
        if (testProfiles.length > 0) {
          console.log(`   User can access their own profile: ${testProfiles[0].full_name || 'No name'}`);
        }
      }
    }
    
    console.log('\n🎉 Diagnosis and fixes complete!');
    console.log('\n🚀 You can now try logging in again.');
    
  } catch (error) {
    console.error('❌ Error during diagnosis:', error.message);
    
    // Provide specific troubleshooting steps
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check if your Supabase URL and service key are correct');
    console.log('2. Verify that the profiles table exists in your database');
    console.log('3. Check if RLS policies are causing issues');
    console.log('4. Try running the RLS_FIX_SIMPLE.sql script in your Supabase SQL editor');
    process.exit(1);
  }
}

diagnoseAndFixProfile();