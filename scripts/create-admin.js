const { createClient } = require('@supabase/supabase-js')

// Configuration - Replace with your actual values
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tcnumqnrunxoejnqykwt.supabase.co'
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjbnVtcW5ydW54b2VqbnF5a3d0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU3NTI3MiwiZXhwIjoyMDcyMTUxMjcyfQ.2mUWSO_Wg216A66qMVMhj4n4wnqbrSvyNFavaW-PCi8'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

async function createAdminUser() {
  console.log('🔐 Creating Admin User')
  console.log('=====================')
  
  // Admin user details
  const adminEmail = 'admin@meftahi-immo.tn'
  const adminPassword = 'SecurePass123!' // Change this to a secure password
  const adminFullName = 'Admin User'
  const adminPhone = '+216XXXXXXXX'
  
  try {
    console.log('📧 Creating auth user...')
    
    // Create the user in auth system
    const { data: authUser, error: signUpError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        full_name: adminFullName,
        phone: adminPhone
      }
    })
    
    if (signUpError) {
      if (signUpError.message.includes('already exists')) {
        console.log('⚠️  User already exists, fetching existing user...')
        const { data: existingUsers, error: fetchError } = await supabase.auth.admin.listUsers()
        if (fetchError) throw fetchError
        
        const existingUser = existingUsers.users.find(user => user.email === adminEmail)
        if (!existingUser) throw new Error('Could not find existing user')
        
        console.log('👤 Found existing user:', existingUser.id)
      } else {
        throw signUpError
      }
    } else {
      console.log('✅ Auth user created successfully')
      console.log('   User ID:', authUser.user.id)
    }
    
    // Get the user ID (either new or existing)
    const { data: users, error: fetchError } = await supabase.auth.admin.listUsers()
    if (fetchError) throw fetchError
    
    const user = users.users.find(u => u.email === adminEmail)
    if (!user) throw new Error('Could not find user')
    
    console.log('👤 User ID:', user.id)
    
    console.log('👤 Creating/updating profile...')
    
    // Create/update profile with admin role
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: adminFullName,
        phone: adminPhone,
        role: 'admin'
      }, {
        onConflict: 'id'
      })
    
    if (profileError) throw profileError
    console.log('✅ Profile created/updated with admin role')
    
    console.log('\n🎉 Admin user setup complete!')
    console.log('📧 Email:', adminEmail)
    console.log('🔑 Password:', adminPassword)
    console.log('👤 User ID:', user.id)
    console.log('\n🚀 You can now log in at http://localhost:3000/login')
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    process.exit(1)
  }
}

createAdminUser()