'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Sign in the user
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        // Small delay to ensure session is established
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Try to get the user's profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, role')
          .eq('id', data.user.id)
          .single()

        // If profile doesn't exist, create it
        if (profileError && profileError.code === 'PGRST116') {
          console.log('Profile not found, creating one...')
          
          // Get user metadata from auth
          const fullName = data.user.user_metadata?.full_name || email.split('@')[0]
          const phone = data.user.user_metadata?.phone || ''
          
          // Try to insert profile, handle conflicts
          const { error: insertError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              full_name: fullName,
              phone: phone,
              role: 'admin' // Default to admin for self-hosted version
            }, {
              onConflict: 'id'
            })
          
          if (insertError) {
            console.error('Error creating profile:', insertError)
            setError('Une erreur est survenue lors de la création du profil: ' + insertError.message)
            await supabase.auth.signOut()
            setLoading(false)
            return
          }
          
          // Try to get profile again
          const { data: newProfile, error: newProfileError } = await supabase
            .from('profiles')
            .select('id, full_name, role')
            .eq('id', data.user.id)
            .single()
            
          if (newProfileError) {
            setError('Une erreur est survenue lors de la vérification du profil: ' + newProfileError.message)
            await supabase.auth.signOut()
            setLoading(false)
            return
          }
          
          // Check if user has admin role
          if (newProfile && newProfile.role === 'admin') {
            toast.success('Connexion réussie')
            router.push('/admin')
          } else {
            await supabase.auth.signOut()
            setError('Accès non autorisé. Seuls les administrateurs peuvent se connecter.')
          }
          return
        } else if (profileError) {
          setError('Une erreur est survenue lors de la vérification du profil: ' + profileError.message)
          await supabase.auth.signOut()
          setLoading(false)
          return
        }

        // Check if user has admin role
        if (profile && profile.role === 'admin') {
          toast.success('Connexion réussie')
          router.push('/admin')
        } else {
          await supabase.auth.signOut()
          setError('Accès non autorisé. Seuls les administrateurs peuvent se connecter.')
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('Une erreur est survenue lors de la connexion: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MEFTAHI IMMO</h1>
          <p className="text-gray-600 mt-2">Espace Administration</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Connectez-vous à votre espace administrateur
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@meftahi-immo.tn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Se connecter
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                href="/register" 
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Créer un compte administrateur
              </Link>
              <span className="mx-2 text-muted-foreground">|</span>
              <Link 
                href="/" 
                className="text-sm text-muted-foreground hover:text-primary"
              >
                ← Retour au site
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Accès réservé aux administrateurs autorisés</p>
        </div>
      </div>
    </div>
  )
}