'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'

export default function SetupAdminPage() {
  const [userId, setUserId] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Check if user exists
      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (user) {
        // Update existing profile to admin
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin', full_name: fullName, phone: phone })
          .eq('id', userId)

        if (updateError) {
          setError(updateError.message)
          return
        }

        setSuccess(true)
        toast.success('Profil administrateur mis à jour avec succès!')
      } else {
        // Create new profile as admin
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: fullName,
            phone: phone,
            role: 'admin'
          })

        if (insertError) {
          setError(insertError.message)
          return
        }

        setSuccess(true)
        toast.success('Profil administrateur créé avec succès!')
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la configuration')
    } finally {
      setLoading(false)
    }
  }

  const handleGetUserId = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        toast.success('ID utilisateur récupéré avec succès!')
      } else {
        toast.error('Vous devez être connecté pour récupérer votre ID')
      }
    } catch (err) {
      toast.error('Erreur lors de la récupération de votre ID')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MEFTAHI IMMO</h1>
          <p className="text-gray-600 mt-2">Configuration Administrateur</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configurer l&apos;administrateur</CardTitle>
            <CardDescription>
              Configurez votre compte administrateur
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {success ? (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-green-600 mb-4">Configuration réussie!</p>
                <p className="text-sm text-muted-foreground">
                  Vous pouvez maintenant accéder à l&apos;administration.
                </p>
                <Button 
                  onClick={() => router.push('/login')} 
                  className="mt-4"
                >
                  Aller à la connexion
                </Button>
              </div>
            ) : (
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="userId">ID Utilisateur</Label>
                  <div className="flex gap-2">
                    <Input
                      id="userId"
                      type="text"
                      placeholder="UUID de votre utilisateur"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      required
                      disabled={loading}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      onClick={handleGetUserId}
                      disabled={loading}
                    >
                      Récupérer
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Connectez-vous d&apos;abord, puis cliquez sur &quot;Récupérer&quot;
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom complet</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Votre nom complet"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Numéro de téléphone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                  Configurer comme administrateur
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Page de configuration administrative</p>
        </div>
      </div>
    </div>
  )
}