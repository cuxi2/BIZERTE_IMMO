const { createClient } = require('@supabase/supabase-js')

// Configuration - Replace with your actual values
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error('⚠️  Missing environment variables!')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

async function fixProfiles() {
  console.log('🔧 Fixing profiles...')
  
  try {
    // Get all auth users
    const { data: users, error: usersError } = await supabase
      .from('auth.users')
      .select('id, email, raw_user_meta_data')
    
    if (usersError) {
      console.error('❌ Error fetching auth users:', usersError.message)
      return
    }
    
    console.log(`✅ Found ${users.length} auth users`)
    
    // Get all existing profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError.message)
      return
    }
    
    const profileIds = new Set(profiles.map(p => p.id))
    console.log(`✅ Found ${profiles.length} existing profiles`)
    
    // Create profiles for users that don't have them
    for (const user of users) {
      if (!profileIds.has(user.id)) {
        console.log(`🔧 Creating profile for user: ${user.email}`)
        
        const fullName = user.raw_user_meta_data?.full_name || 'Admin User'
        const phone = user.raw_user_meta_data?.phone || ''
        
        // Determine role - first user gets admin, others get client
        const role = profiles.length === 0 ? 'admin' : 'client'
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: fullName,
            phone: phone,
            role: role
          })
        
        if (insertError) {
          console.error(`❌ Error creating profile for ${user.email}:`, insertError.message)
        } else {
          console.log(`✅ Profile created for ${user.email} with role: ${role}`)
          profiles.length++ // Increment to ensure next user gets client role
        }
      }
    }
    
    console.log('✅ Profile fixing completed!')
    
  } catch (error) {
    console.error('💥 Unexpected error:', error.message)
  }
}

fixProfiles()