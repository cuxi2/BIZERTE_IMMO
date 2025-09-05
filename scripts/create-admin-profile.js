// Script to create an admin profile
const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE

console.log('🔧 Creating admin profile...')

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

async function createAdminProfile() {
  try {
    // You'll need to replace these with actual values
    const userId = 'YOUR_USER_ID_HERE' // Get this from Supabase Auth dashboard
    const fullName = 'Admin User'
    const phone = '+1234567890'
    
    console.log(`📝 Creating admin profile for user: ${userId}`)
    
    // Create or update the profile
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: fullName,
        phone: phone,
        role: 'admin'
      }, {
        onConflict: 'id'
      })
    
    if (error) {
      console.error('❌ Error creating admin profile:', error.message)
      return
    }
    
    console.log('✅ Admin profile created successfully!')
    console.log('🌐 You can now log in at: http://localhost:3001/login')
    
  } catch (error) {
    console.error('💥 Unexpected error:', error.message)
  }
}

// Run the function
createAdminProfile()