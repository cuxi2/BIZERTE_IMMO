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

export default function CreateAdminPage() {
  const [email, setEmail] = useState('admin@meftahi-immo.tn')
  const [password, setPassword] = useState('SecurePass123!')
  const [fullName, setFullName] = useState('Admin User')
  const [phone, setPhone] = useState('+216XXXXXXXX')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Create the user with admin privileges
      const { data, error: signUpError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Skip email confirmation
        user_metadata: {
          full_name: fullName,
          phone: phone
        }
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (data.user) {
        // Create profile with admin role
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            full_name: fullName,
            phone: phone,
            role: 'admin'
          }, {
            onConflict: 'id'
          })

        if (profileError) {
          setError('Error creating profile: ' + profileError.message)
          return
        }

        setSuccess(true)
      }
    } catch (err) {
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
          <p className="text-gray-600 mt-2">Create Admin Account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Admin Account</CardTitle>
            <CardDescription>
              Set up the initial administrator account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {success ? (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-green-600 mb-4">Admin account created successfully!</p>
                <p className="text-sm text-muted-foreground">
                  Email: {email}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  You can now log in to the admin panel.
                </p>
                <Button 
                  onClick={() => router.push('/login')} 
                  className="w-full mt-6"
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Admin User"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+216XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

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
                    placeholder="SecurePass123!"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Admin Account
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Button 
                variant="outline"
                onClick={() => router.push('/')} 
                className="text-sm"
              >
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>For administrator use only</p>
        </div>
      </div>
    </div>
  )
}