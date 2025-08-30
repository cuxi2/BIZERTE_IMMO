'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/date'
import { Calendar, MapPin, Phone, Mail, Check, X, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface VisitWithListing {
  id: string
  scheduled_at: string
  duration_min: number
  status: string
  notes?: string
  contact_email?: string
  contact_phone?: string
  contact_name?: string
  created_at: string
  listing: {
    id: string
    title: string
    slug: string
    city: string
    address?: string
  }
}

export default function AdminVisitsPage() {
  const [visits, setVisits] = useState<VisitWithListing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVisits()
  }, [])

  const fetchVisits = async () => {
    try {
      const { data, error } = await supabase
        .from('visits')
        .select(`
          *,
          listing:listings(id, title, slug, city, address)
        `)
        .order('scheduled_at', { ascending: true })

      if (error) throw error

      setVisits(data || [])
    } catch (error) {
      toast.error('Erreur lors du chargement des visites')
      console.error('Error fetching visits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('visits')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      toast.success('Statut mis à jour')
      setVisits(prev =>
        prev.map(v => v.id === id ? { ...v, status: newStatus } : v)
      )
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
      console.error('Error updating visit status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmée'
      case 'pending': return 'En attente'
      case 'cancelled': return 'Annulée'
      case 'completed': return 'Terminée'
      default: return status
    }
  }

  const isPastVisit = (scheduledAt: string) => {
    return new Date(scheduledAt) < new Date()
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Gestion des visites</h1>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Separate upcoming and past visits
  const upcomingVisits = visits.filter(v => !isPastVisit(v.scheduled_at))
  const pastVisits = visits.filter(v => isPastVisit(v.scheduled_at))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gestion des visites</h1>
        <div className="text-sm text-gray-500">
          {visits.length} visite{visits.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Upcoming Visits */}
      {upcomingVisits.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Visites à venir</h2>
          <div className="space-y-4">
            {upcomingVisits.map((visit) => (
              <Card key={visit.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {visit.listing.title}
                    </CardTitle>
                    <Badge className={getStatusColor(visit.status)}>
                      {getStatusLabel(visit.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{formatDateTime(visit.scheduled_at)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{visit.duration_min} minutes</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{visit.listing.address || visit.listing.city}</span>
                    </div>
                    
                    {visit.contact_name && (
                      <div>
                        <span className="font-medium">Contact:</span> {visit.contact_name}
                      </div>
                    )}
                    
                    {visit.contact_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{visit.contact_email}</span>
                      </div>
                    )}
                    
                    {visit.contact_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{visit.contact_phone}</span>
                      </div>
                    )}
                  </div>

                  {visit.notes && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{visit.notes}</p>
                    </div>
                  )}

                  {visit.status === 'pending' && (
                    <div className="flex items-center gap-2 pt-4 border-t">
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(visit.id, 'confirmed')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Confirmer
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(visit.id, 'cancelled')}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Annuler
                      </Button>
                    </div>
                  )}
                  
                  {visit.status === 'confirmed' && (
                    <div className="flex items-center gap-2 pt-4 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(visit.id, 'completed')}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Marquer comme terminée
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Visits */}
      {pastVisits.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Visites passées</h2>
          <div className="space-y-4">
            {pastVisits.slice(0, 10).map((visit) => (
              <Card key={visit.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {visit.listing.title}
                    </CardTitle>
                    <Badge className={getStatusColor(visit.status)}>
                      {getStatusLabel(visit.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDateTime(visit.scheduled_at)}</span>
                    </div>
                    
                    {visit.contact_name && (
                      <div>
                        <span className="font-medium">Contact:</span> {visit.contact_name}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{visit.listing.city}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {visits.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune visite programmée
            </h3>
            <p className="text-gray-600">
              Les demandes de visite apparaîtront ici.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}