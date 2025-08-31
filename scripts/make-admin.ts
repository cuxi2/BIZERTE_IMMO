import { createClient } from '@supabase/supabase-js'

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error('Missing environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

async function makeAdmin() {
  // Get user ID from command line argument or prompt
  const userId = process.argv[2] || '77787087-dab9-4930-ab8b-3f263d189af1'
  
  if (!userId) {
    console.error('Please provide a user ID as a command line argument')
    process.exit(1)
  }

  console.log(`Making user ${userId} an admin...`)

  try {
    // Update user metadata using Admin API
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role: 'admin' }
    })

    if (error) {
      console.error('Failed to update user metadata:', error)
      process.exit(1)
    }

    console.log('User metadata updated successfully!')
    console.log('User data:', data.user)

    // Also update the profiles table to ensure consistency
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        role: 'admin'
      }, {
        onConflict: 'id'
      })

    if (profileError) {
      console.error('Failed to update profiles table:', profileError)
    } else {
      console.log('Profiles table updated successfully!')
    }

  } catch (err) {
    console.error('Unexpected error:', err)
    process.exit(1)
  }
}

makeAdmin()