const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error('⚠️  Missing environment variables!')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

async function checkAndFixProfiles() {
  console.log('🔍 Checking and fixing profiles...')
  
  try {
    // Get all auth users
    console.log('📋 Getting all auth users...')
    const { data: users, error: usersError } = await supabase
      .from('auth.users')
      .select('id, email, created_at, raw_user_meta_data')
      .order('created_at')
    
    if (usersError) {
      console.error('❌ Error fetching auth users:', usersError.message)
      return
    }
    
    console.log(`✅ Found ${users.length} auth user(s)`)
    
    // Get all existing profiles
    console.log('📋 Getting all existing profiles...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, role, created_at')
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError.message)
      return
    }
    
    console.log(`✅ Found ${profiles.length} profile(s)`)
    
    // Create a map of existing profiles for quick lookup
    const profileMap = new Map(profiles.map(p => [p.id, p]))
    
    // Check each user
    for (const user of users) {
      console.log(`\n👤 Checking user: ${user.email} (${user.id})`)
      
      if (profileMap.has(user.id)) {
        // Profile exists
        const profile = profileMap.get(user.id)
        console.log(`   ✅ Profile exists - Role: ${profile.role}, Name: ${profile.full_name || 'Not set'}`)
        
        // If this is the first user and doesn't have admin role, fix it
        if (users.indexOf(user) === 0 && profile.role !== 'admin') {
          console.log(`   ⚠️  First user doesn't have admin role, fixing...`)
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', user.id)
          
          if (updateError) {
            console.error(`   ❌ Error updating profile:`, updateError.message)
          } else {
            console.log(`   ✅ Profile updated to admin role`)
          }
        }
      } else {
        // Profile missing, create it
        console.log(`   ❌ Profile missing, creating one...`)
        
        const fullName = user.raw_user_meta_data?.full_name || user.email.split('@')[0]
        const phone = user.raw_user_meta_data?.phone || ''
        const role = users.indexOf(user) === 0 ? 'admin' : 'client'
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: fullName,
            phone: phone,
            role: role
          })
        
        if (insertError) {
          console.error(`   ❌ Error creating profile:`, insertError.message)
        } else {
          console.log(`   ✅ Profile created with role: ${role}`)
        }
      }
    }
    
    console.log('\n✅ Profile check and fix completed!')
    
    // Show final state
    console.log('\n📋 Final profile list:')
    const { data: finalProfiles, error: finalError } = await supabase
      .from('profiles')
      .select('id, full_name, role, created_at')
      .order('created_at')
    
    if (finalProfiles) {
      finalProfiles.forEach((profile, index) => {
        console.log(`   ${index + 1}. ${profile.full_name || 'No name'} (${profile.id}) - ${profile.role}`)
      })
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error.message)
  }
}

checkAndFixProfiles()