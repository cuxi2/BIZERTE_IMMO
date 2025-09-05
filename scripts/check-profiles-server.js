const { createClient } = require('@supabase/supabase-js')

// Configuration - Using the same environment variables as the app
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error('⚠️  Missing environment variables!')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE')
  process.exit(1)
}

// Create a service role client that can access all tables
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: {
    persistSession: false
  }
})

async function checkProfiles() {
  console.log('🔍 Checking profiles in database...')
  
  try {
    // Get all profiles
    console.log('📋 Getting all profiles...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, phone, role, created_at')
      .order('created_at')
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError.message)
      return
    }
    
    console.log(`✅ Found ${profiles.length} profile(s)`)
    
    if (profiles.length === 0) {
      console.log('⚠️  No profiles found in database')
      console.log('💡 You may need to create an account through the registration page first')
      return
    }
    
    // Display all profiles
    console.log('\n📋 Profile list:')
    profiles.forEach((profile, index) => {
      console.log(`   ${index + 1}. ${profile.full_name || 'No name'} (${profile.id})`)
      console.log(`      Role: ${profile.role}`)
      console.log(`      Phone: ${profile.phone || 'Not set'}`)
      console.log(`      Created: ${profile.created_at}`)
      console.log('')
    })
    
    // Check for admin users
    const adminProfiles = profiles.filter(p => p.role === 'admin')
    console.log(`\n🔐 Admin users: ${adminProfiles.length}`)
    
    if (adminProfiles.length === 0) {
      console.log('⚠️  No admin users found!')
      console.log('💡 The first registered user should automatically get admin role')
      console.log('💡 If you have users but no admins, you may need to manually assign admin role')
    } else {
      console.log('✅ Admin users found:')
      adminProfiles.forEach((admin, index) => {
        console.log(`   ${index + 1}. ${admin.full_name || 'No name'} (${admin.id})`)
      })
    }
    
    console.log('\n✅ Profile check completed!')
    
  } catch (error) {
    console.error('💥 Unexpected error:', error.message)
  }
}

checkProfiles()