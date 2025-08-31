import { createClient } from '@supabase/supabase-js'

// ⚠️ UTILISE TA CLÉ SERVICE ROLE ICI (PAS L'ANON KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function promoteToAdmin() {
  const { error } = await supabase.auth.admin.updateUserById(
    '1d506ecb-c980-47df-a05a-e07bfd2a1c3a',
    { user_metadata: { role: 'admin' } }
  )

  if (error) {
    console.error('❌ Erreur lors de la promotion admin:', error.message)
  } else {
    console.log('✅ Utilisateur promu admin avec succès !')
  }
}

promoteToAdmin()