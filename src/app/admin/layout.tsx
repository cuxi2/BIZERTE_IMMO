'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Building2, Calendar, Users, Settings, LogOut, Home } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { signOut, profile } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const navigation = [
    {
      name: 'Tableau de bord',
      href: '/admin',
      icon: Home,
      current: pathname === '/admin'
    },
    {
      name: 'Biens immobiliers',
      href: '/admin/listings',
      icon: Building2,
      current: pathname.startsWith('/admin/listings')
    },
    {
      name: 'Réservations',
      href: '/admin/reservations',
      icon: Calendar,
      current: pathname.startsWith('/admin/reservations')
    },
    {
      name: 'Visites',
      href: '/admin/visits',
      icon: Users,
      current: pathname.startsWith('/admin/visits')
    }
  ]

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center justify-center border-b border-gray-200">
              <h1 className="text-xl font-bold text-primary">MEFTAHI ADMIN</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      item.current
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* User info & Sign out */}
            <div className="border-t border-gray-200 p-4">
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.full_name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">{profile?.role}</p>
              </div>
              
              <div className="space-y-2">
                <Link href="/">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Home className="h-4 w-4 mr-2" />
                    Voir le site
                  </Button>
                </Link>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="pl-64">
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}