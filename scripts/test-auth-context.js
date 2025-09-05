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

async function testAuthContext() {
  const userId = '1d506ecb-c980-47df-a05a-e07bfd2a1c3a'
  
  console.log('🔍 Testing authentication context for user ID:', userId)
  console.log('🔗 Supabase URL:', SUPABASE_URL)
  console.log('')

  try {
    // Test 1: Get user session info
    console.log('📋 Test 1: Checking current session...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Session check failed:', sessionError.message)
    } else {
      console.log('✅ Session check completed')
      console.log('   Session exists:', !!session)
    }

    console.log('')

    // Test 2: Check user authentication status
    console.log('📋 Test 2: Checking user authentication status...')
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('❌ User check failed:', userError.message)
    } else {
      console.log('✅ User check completed')
      console.log('   Authenticated user exists:', !!user)
      if (user) {
        console.log('   Auth user ID:', user.id)
        console.log('   Auth user email:', user.email)
      }
    }

    console.log('')

    // Test 3: Direct profile access with service role (bypassing RLS)
    console.log('📋 Test 3: Direct profile access with service role...')
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, phone, role')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.error('❌ Direct profile access failed:', profileError.message)
    } else if (profile) {
      console.log('✅ Profile found via service role:')
      console.log('   Full Name:', profile.full_name || 'Not set')
      console.log('   Phone:', profile.phone || 'Not set')
      console.log('   Role:', profile.role)
      console.log('   Is Admin:', profile.role === 'admin' ? '✅ YES' : '❌ NO')
    } else {
      console.log('❌ Profile not found via service role')
    }

    console.log('')

    // Test 4: Simulate user access (with RLS)
    console.log('📋 Test 4: Simulating user access with RLS...')
    // This is tricky to simulate without actual user login, but we can check if the policies are correct
    console.log('   RLS Policy Check:')
    console.log('   - "Profiles: read own" policy: auth.uid() = id')
    console.log('   - "Profiles: admin read all" policy: exists(select 1 from profiles where id = auth.uid() and role = \'admin\')')
    console.log('')
    console.log('   For user', userId, 'to access their own profile:')
    console.log('   - auth.uid() should equal', userId)
    console.log('   - This should work if the user is properly authenticated')

  } catch (error) {
    console.error('💥 Unexpected error:', error.message)
  }
}

testAuthContext()