'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/date'
import { formatPrice } from '@/utils/price'
import { Calendar, MapPin, Phone, Mail, Check, X } from 'lucide-react'
import { toast } from 'sonner'

interface ReservationWithListing {
  id: string
  start_date: string
  end_date: string
  status: string
  total_price?: number
  notes?: string
  contact_email?: string
  contact_phone?: string
  created_at: string
  listing: {
    id: string
    title: string
    slug: string
    city: string
    price: number
    currency: string
  }
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<ReservationWithListing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          listing:listings(id, title, slug, city, price, currency)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setReservations(data || [])
    } catch (error) {
      toast.error('Erreur lors du chargement des réservations')
      console.error('Error fetching reservations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      toast.success('Statut mis à jour')
      setReservations(prev =>
        prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
      )
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
      console.error('Error updating reservation status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmée'
      case 'pending': return 'En attente'
      case 'cancelled': return 'Annulée'
      default: return status
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Gestion des réservations</h1>
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gestion des réservations</h1>
        <div className="text-sm text-gray-500">
          {reservations.length} réservation{reservations.length > 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-6">
        {reservations.map((reservation) => (
          <Card key={reservation.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {reservation.listing.title}
                </CardTitle>
                <Badge className={getStatusColor(reservation.status)}>
                  {getStatusLabel(reservation.status)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>
                    Du {formatDate(reservation.start_date)} au {formatDate(reservation.end_date)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{reservation.listing.city}</span>
                </div>
                
                <div>
                  <span className="font-medium">Prix:</span> {formatPrice(reservation.listing.price, reservation.listing.currency)}
                </div>
                
                {reservation.contact_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{reservation.contact_email}</span>
                  </div>
                )}
                
                {reservation.contact_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{reservation.contact_phone}</span>
                  </div>
                )}
                
                <div>
                  <span className="font-medium">Demande le:</span> {formatDate(reservation.created_at)}
                </div>
              </div>

              {reservation.notes && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{reservation.notes}</p>
                </div>
              )}

              {reservation.status === 'pending' && (
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Confirmer
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Refuser
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {reservations.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune réservation
              </h3>
              <p className="text-gray-600">
                Les demandes de réservation apparaîtront ici.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}