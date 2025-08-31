'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Calendar, Users, TrendingUp, Eye, Plus } from 'lucide-react'
import { formatPrice } from '@/utils/price'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface DashboardStats {
  totalListings: number
  publishedListings: number
  pendingReservations: number
  upcomingVisits: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    publishedListings: 0,
    pendingReservations: 0,
    upcomingVisits: 0,
    totalRevenue: 0
  })
  const [recentListings, setRecentListings] = useState<Database['public']['Tables']['listings']['Row'][]>([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch listings stats
      const { data: allListings } = await supabase
        .from('listings')
        .select('*')
      
      const { data: publishedListings } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'publie')

      // Fetch reservations stats
      const { data: pendingReservations } = await supabase
        .from('reservations')
        .select('*')
        .eq('status', 'pending')

      // Fetch upcoming visits
      const { data: upcomingVisits } = await supabase
        .from('visits')
        .select('*')
        .eq('status', 'pending')
        .gte('scheduled_at', new Date().toISOString())

      // Fetch recent listings
      const { data: recent } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        totalListings: allListings?.length || 0,
        publishedListings: publishedListings?.length || 0,
        pendingReservations: pendingReservations?.length || 0,
        upcomingVisits: upcomingVisits?.length || 0,
        totalRevenue: 0 // This would be calculated based on confirmed reservations
      })

      setRecentListings(recent || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total des biens',
      value: stats.totalListings,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Biens publiés',
      value: stats.publishedListings,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Réservations en attente',
      value: stats.pendingReservations,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Visites prévues',
      value: stats.upcomingVisits,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <Link href="/admin/listings/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau bien
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Listings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Biens récents
              <Link href="/admin/listings">
                <Button variant="outline" size="sm">Voir tout</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentListings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{listing.title}</h4>
                    <p className="text-xs text-gray-500">
                      {listing.kind} • {listing.purpose} • {listing.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      {formatPrice(listing.price, listing.currency)}
                    </p>
                    <p className="text-xs text-gray-500">{listing.status}</p>
                  </div>
                </div>
              ))}
              
              {recentListings.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Aucun bien récent
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/admin/listings/new">
                <Button className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un nouveau bien
                </Button>
              </Link>
              
              <Link href="/admin/reservations">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Gérer les réservations
                </Button>
              </Link>
              
              <Link href="/admin/visits">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Voir les visites
                </Button>
              </Link>
              
              <Link href="/catalog">
                <Button variant="ghost" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  Prévisualiser le site
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}