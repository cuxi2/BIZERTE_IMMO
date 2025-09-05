'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface Profile {
  id: string
  full_name: string | null
  role: string
}

export default function TestAdminPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        
        if (!currentUser) {
          router.push('/login')
          return
        }
        
        setUser(currentUser)
        
        // Get profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, role')
          .eq('id', currentUser.id)
          .single()
          
        if (profileError) {
          setError('Error fetching profile: ' + profileError.message)
        } else {
          setProfile(profileData)
        }
      } catch (err) {
        setError('Unexpected error: ' + (err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    
    checkUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Vérification de l&apos;accès administrateur...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Test d&apos;accès administrateur</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        {user && (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations utilisateur</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID utilisateur</p>
                  <p className="font-medium">{user.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            </div>
            
            {profile && (
              <div className="bg-green-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Profil utilisateur</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom complet</p>
                    <p className="font-medium">{profile.full_name || 'Non défini'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rôle</p>
                    <p className="font-medium">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        profile.role === 'admin' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {profile.role}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <p className="text-lg font-medium">
                    {profile.role === 'admin' ? (
                      <span className="text-green-600">✅ Accès administrateur confirmé</span>
                    ) : (
                      <span className="text-red-600">❌ Accès administrateur refusé</span>
                    )}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex justify-center gap-4 mt-8">
              <Button onClick={handleLogout} variant="outline">
                Déconnexion
              </Button>
              <Button onClick={() => router.push('/admin')}>
                Accéder à l&apos;administration
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}