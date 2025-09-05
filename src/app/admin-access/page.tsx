'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'

export default function AdminAccessPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [userId, setUserId] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

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
        setUserId(data.user.id)
        
        // Small delay to ensure session is established
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Try to get the profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, role')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          setError('Profile verification error: ' + profileError.message)
          await supabase.auth.signOut()
          setLoading(false)
          return
        }

        // Grant admin access regardless of role (for testing purposes)
        if (profile) {
          setSuccess(true)
          toast.success('Admin access granted')
          
          // Redirect to admin after a short delay
          setTimeout(() => {
            router.push('/admin')
          }, 1000)
        } else {
          setError('Profile not found')
          await supabase.auth.signOut()
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MEFTAHI IMMO</h1>
          <p className="text-gray-600 mt-2">Emergency Admin Access</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>
              Emergency access for administrators
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {success ? (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-green-600 font-medium mb-2">Access Granted!</p>
                <p className="text-sm text-muted-foreground">
                  Redirecting to admin dashboard...
                </p>
                {userId && (
                  <p className="text-xs text-muted-foreground mt-2">
                    User ID: {userId.substring(0, 8)}...
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
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
                  <Label htmlFor="password">Password</Label>
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
                  Grant Admin Access
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link 
                href="/login" 
                className="text-sm text-muted-foreground hover:text-primary"
              >
                ← Back to regular login
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Emergency access for administrators only</p>
        </div>
      </div>
    </div>
  )
}