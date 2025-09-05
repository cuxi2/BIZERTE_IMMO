const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE

console.log('🔍 Checking users and profiles in Supabase...')

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

async function checkUsersAndProfiles() {
  try {
    console.log('\n📋 Checking Auth Users...')
    // Note: We can't directly query auth.users with service role key
    // But we can check the profiles table which should have matching entries
    
    console.log('\n📋 Checking Profiles...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at')
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError.message)
      return
    }
    
    console.log(`✅ Found ${profiles.length} profile(s)`)
    
    if (profiles.length > 0) {
      console.log('\n📋 All profiles:')
      profiles.forEach((profile, index) => {
        console.log(`   ${index + 1}. ${profile.full_name || 'No name'} (${profile.id})`)
        console.log(`      Role: ${profile.role}`)
        console.log(`      Phone: ${profile.phone || 'Not set'}`)
        console.log(`      Created: ${profile.created_at}`)
        console.log('')
      })
      
      // Check for admin users
      const adminProfiles = profiles.filter(p => p.role === 'admin')
      if (adminProfiles.length > 0) {
        console.log(`✅ Found ${adminProfiles.length} admin user(s):`)
        adminProfiles.forEach((admin, index) => {
          console.log(`   ${index + 1}. ${admin.full_name || 'No name'} (${admin.id})`)
        })
        console.log('\n💡 You already have admin users. Try logging in at http://localhost:3001/login')
      } else {
        console.log('⚠️  No admin users found.')
        console.log('💡 You need to assign admin role to one of the existing profiles.')
      }
    } else {
      console.log('⚠️  No profiles found.')
      console.log('💡 You need to create an account through the registration page first.')
      console.log('🌐 Visit: http://localhost:3001/register')
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error.message)
  }
}

checkUsersAndProfiles()