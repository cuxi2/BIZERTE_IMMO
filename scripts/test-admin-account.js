const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE

console.log('🔧 Testing Supabase connection and admin account...')

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

async function testAdminAccount() {
  try {
    console.log('🔍 Checking for existing admin accounts...')
    
    // Get all profiles with admin role
    const { data: adminProfiles, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, created_at')
      .eq('role', 'admin')
    
    if (error) {
      console.error('❌ Error fetching admin profiles:', error.message)
      return
    }
    
    console.log(`✅ Found ${adminProfiles.length} admin account(s)`)
    
    if (adminProfiles.length > 0) {
      console.log('\n📋 Admin accounts:')
      adminProfiles.forEach((profile, index) => {
        console.log(`   ${index + 1}. ${profile.full_name || 'No name'} (${profile.id})`)
        console.log(`      Role: ${profile.role}`)
        console.log(`      Created: ${profile.created_at}`)
        console.log('')
      })
      
      console.log('✅ You already have admin accounts. You can log in using the regular login page.')
      console.log('🌐 Visit: http://localhost:3001/login')
    } else {
      console.log('⚠️  No admin accounts found.')
      console.log('💡 You need to create an account through the registration page first.')
      console.log('🌐 Visit: http://localhost:3001/register')
    }
    
    // Also check all profiles
    console.log('\n📋 All profiles in database:')
    const { data: allProfiles, error: allProfilesError } = await supabase
      .from('profiles')
      .select('id, full_name, role, created_at')
      .order('created_at')
    
    if (allProfilesError) {
      console.error('❌ Error fetching all profiles:', allProfilesError.message)
      return
    }
    
    if (allProfiles.length === 0) {
      console.log('   No profiles found.')
    } else {
      allProfiles.forEach((profile, index) => {
        console.log(`   ${index + 1}. ${profile.full_name || 'No name'} (${profile.id}) - ${profile.role}`)
      })
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error.message)
  }
}

testAdminAccount()