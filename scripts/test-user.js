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

async function testUser() {
  const userId = '1d506ecb-c980-47df-a05a-e07bfd2a1c3a'
  
  console.log('🔍 Testing user with ID:', userId)
  console.log('🔗 Supabase URL:', SUPABASE_URL)
  console.log('')

  try {
    // Test 1: Check if user exists in auth system
    console.log('📋 Test 1: Checking auth user...')
    const { data: authUser, error: authError } = await supabase
      .from('auth.users')
      .select('id, email, created_at')
      .eq('id', userId)
      .single()

    if (authError) {
      console.error('❌ Auth user check failed:', authError.message)
    } else if (authUser) {
      console.log('✅ Auth user found:')
      console.log('   Email:', authUser.email)
      console.log('   Created:', authUser.created_at)
    } else {
      console.log('❌ Auth user not found')
    }

    console.log('')

    // Test 2: Check profile in profiles table
    console.log('📋 Test 2: Checking profiles table...')
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, phone, role')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.error('❌ Profile check failed:', profileError.message)
    } else if (profile) {
      console.log('✅ Profile found:')
      console.log('   Full Name:', profile.full_name || 'Not set')
      console.log('   Phone:', profile.phone || 'Not set')
      console.log('   Role:', profile.role)
      console.log('   Is Admin:', profile.role === 'admin' ? '✅ YES' : '❌ NO')
    } else {
      console.log('❌ Profile not found')
    }

    console.log('')

    // Test 3: Check if any admins exist
    console.log('📋 Test 3: Checking for existing admins...')
    const { data: admins, error: adminsError } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('role', 'admin')

    if (adminsError) {
      console.error('❌ Admin check failed:', adminsError.message)
    } else {
      console.log(`✅ Found ${admins.length} admin(s):`)
      admins.forEach((admin, index) => {
        console.log(`   ${index + 1}. ${admin.full_name || 'No name'} (${admin.id})`)
      })
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error.message)
  }
}

testUser()