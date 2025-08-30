'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Gallery from '@/components/Gallery'
import MapPlaceholder from '@/components/MapPlaceholder'
import DateRangePicker from '@/components/DateRangePicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, MapPin, Bed, Bath, Square, Clock, Phone, Mail, AlertCircle } from 'lucide-react'
import { formatPrice, formatArea } from '@/utils/price'
import { formatDate } from '@/lib/date'
import { canBook, getUnavailableDates } from '@/lib/availability'
import { Listing, ListingMedia, Reservation } from '@/types/db'
import { toast } from 'sonner'

export default function ListingDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [listing, setListing] = useState<Listing | null>(null)
  const [media, setMedia] = useState<ListingMedia[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Booking form state
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchListingData()
    }
  }, [slug])

  const fetchListingData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch listing
      const { data: listingData, error: listingError } = await supabase
        .from('listings')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'publie')
        .single()
      
      if (listingError) throw new Error('Bien immobilier non trouvé')
      
      setListing(listingData)
      
      // Fetch media
      const { data: mediaData } = await supabase
        .from('listing_media')
        .select('*')
        .eq('listing_id', listingData.id)
        .order('position')
      
      setMedia(mediaData || [])
      
      // Fetch reservations for availability checking
      const { data: reservationsData } = await supabase
        .from('reservations')
        .select('start_date, end_date, status')
        .eq('listing_id', listingData.id)
        .in('status', ['pending', 'confirmed'])
      
      setReservations(reservationsData || [])
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleBookingSubmit = async () => {
    if (!listing || !startDate || !endDate) {
      toast.error('Veuillez sélectionner des dates')
      return
    }
    
    if (!contactEmail) {
      toast.error('Veuillez fournir votre email')
      return
    }
    
    // Check availability
    if (!canBook(reservations, startDate, endDate)) {
      toast.error('Ces dates ne sont pas disponibles')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const { error } = await supabase
        .from('reservations')
        .insert({
          listing_id: listing.id,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          contact_email: contactEmail,
          contact_phone: contactPhone,
          notes: `${notes}\n\nContact: ${contactName}`.trim()
        })
      
      if (error) throw error
      
      toast.success('Demande de réservation envoyée avec succès!')
      
      // Reset form
      setStartDate(undefined)
      setEndDate(undefined)
      setContactName('')
      setContactEmail('')
      setContactPhone('')
      setNotes('')
      
      // Refresh reservations
      fetchListingData()
      
    } catch (err) {
      toast.error('Erreur lors de l\'envoi de la demande')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVisitRequest = async () => {
    if (!listing || !contactEmail) {
      toast.error('Veuillez fournir votre email')
      return
    }
    
    try {
      const scheduledAt = new Date()
      scheduledAt.setDate(scheduledAt.getDate() + 1) // Tomorrow by default
      scheduledAt.setHours(14, 0, 0, 0) // 14:00
      
      const { error } = await supabase
        .from('visits')
        .insert({
          listing_id: listing.id,
          scheduled_at: scheduledAt.toISOString(),
          contact_email: contactEmail,
          contact_phone: contactPhone,
          contact_name: contactName,
          notes: notes || 'Demande de visite depuis le site web'
        })
      
      if (error) throw error
      
      toast.success('Demande de visite envoyée! Nous vous contacterons pour confirmer.')
      
    } catch (err) {
      toast.error('Erreur lors de l\'envoi de la demande de visite')
    }
  }

  if (loading) {
    return (
      <div className=\"container mx-auto px-4 py-8\">
        <div className=\"grid lg:grid-cols-3 gap-8\">
          <div className=\"lg:col-span-2 space-y-6\">
            <Skeleton className=\"h-8 w-3/4\" />
            <Skeleton className=\"h-4 w-1/2\" />
            <Skeleton className=\"h-64 w-full rounded-xl\" />
            <Skeleton className=\"h-32 w-full\" />
          </div>
          <div className=\"space-y-4\">
            <Skeleton className=\"h-64 w-full rounded-xl\" />
            <Skeleton className=\"h-48 w-full rounded-xl\" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className=\"container mx-auto px-4 py-8\">
        <Alert>
          <AlertCircle className=\"h-4 w-4\" />
          <AlertDescription>{error || 'Bien non trouvé'}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const unavailableDates = getUnavailableDates(reservations)
  const isForRent = listing.purpose === 'location'

  return (
    <div className=\"container mx-auto px-4 py-8\">
      <div className=\"grid lg:grid-cols-3 gap-8\">
        {/* Main Content */}
        <div className=\"lg:col-span-2 space-y-8\">
          {/* Header */}
          <div>
            <div className=\"flex items-center gap-2 mb-3\">
              <Badge className={listing.purpose === 'vente' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                {listing.purpose}
              </Badge>
              <Badge variant=\"outline\">{listing.kind}</Badge>
            </div>
            
            <h1 className=\"text-3xl lg:text-4xl font-bold mb-3\">{listing.title}</h1>
            
            <div className=\"flex items-center text-muted-foreground mb-4\">
              <MapPin className=\"h-4 w-4 mr-1\" />
              <span>{listing.address}, {listing.city}</span>
            </div>
            
            <div className=\"flex items-center justify-between\">
              <div className=\"text-3xl font-bold text-primary\">
                {formatPrice(listing.price, listing.currency)}
                {isForRent && <span className=\"text-lg font-normal\">/mois</span>}
              </div>
              
              {listing.area_m2 && (
                <div className=\"text-muted-foreground\">
                  {formatArea(listing.area_m2)}
                </div>
              )}
            </div>
          </div>

          {/* Gallery */}
          <Gallery media={media} />

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Caractéristiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4 mb-6\">
                {listing.bedrooms && (
                  <div className=\"flex items-center gap-2\">
                    <Bed className=\"h-4 w-4 text-muted-foreground\" />
                    <span>{listing.bedrooms} chambres</span>
                  </div>
                )}
                {listing.bathrooms && (
                  <div className=\"flex items-center gap-2\">
                    <Bath className=\"h-4 w-4 text-muted-foreground\" />
                    <span>{listing.bathrooms} salles de bain</span>
                  </div>
                )}
                {listing.area_m2 && (
                  <div className=\"flex items-center gap-2\">
                    <Square className=\"h-4 w-4 text-muted-foreground\" />
                    <span>{formatArea(listing.area_m2)}</span>
                  </div>
                )}
                {listing.year_built && (
                  <div className=\"flex items-center gap-2\">
                    <Clock className=\"h-4 w-4 text-muted-foreground\" />
                    <span>Construit en {listing.year_built}</span>
                  </div>
                )}
              </div>
              
              {listing.description && (
                <>
                  <Separator className=\"my-6\" />
                  <div>
                    <h3 className=\"font-semibold mb-3\">Description</h3>
                    <p className=\"text-muted-foreground whitespace-pre-wrap\">{listing.description}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Map */}
          <MapPlaceholder
            address={listing.address}
            city={listing.city}
            latitude={listing.latitude}
            longitude={listing.longitude}
          />
        </div>

        {/* Sidebar */}
        <div className=\"space-y-6\">
          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle className=\"flex items-center gap-2\">
                <Phone className=\"h-5 w-5\" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className=\"space-y-4\">
              <Input
                placeholder=\"Votre nom\"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
              <Input
                placeholder=\"Votre email\"
                type=\"email\"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
              <Input
                placeholder=\"Votre téléphone\"
                type=\"tel\"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
              <Textarea
                placeholder=\"Votre message\"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              
              <div className=\"flex flex-col gap-2\">
                <Button 
                  onClick={handleVisitRequest}
                  disabled={!contactEmail}
                  className=\"w-full\"
                >
                  <Calendar className=\"h-4 w-4 mr-2\" />
                  Demander une visite
                </Button>
                
                <div className=\"flex items-center gap-2 text-sm text-muted-foreground\">
                  <Phone className=\"h-3 w-3\" />
                  <span>{process.env.COMPANY_PHONE || '+216 XX XXX XXX'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Card (for rentals only) */}
          {isForRent && (
            <Card>
              <CardHeader>
                <CardTitle className=\"flex items-center gap-2\">
                  <Calendar className=\"h-5 w-5\" />
                  Réserver
                </CardTitle>
              </CardHeader>
              <CardContent className=\"space-y-4\">
                <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                  unavailableDates={unavailableDates.map(d => d.start)}
                />
                
                {startDate && endDate && (
                  <div className=\"p-3 bg-gray-50 rounded-lg\">
                    <p className=\"text-sm font-medium\">Période sélectionnée:</p>
                    <p className=\"text-sm text-muted-foreground\">
                      Du {formatDate(startDate)} au {formatDate(endDate)}
                    </p>
                  </div>
                )}
                
                <Button 
                  onClick={handleBookingSubmit}
                  disabled={!startDate || !endDate || !contactEmail || isSubmitting}
                  className=\"w-full\"
                >
                  {isSubmitting ? 'Envoi...' : 'Demander une réservation'}
                </Button>
                
                <p className=\"text-xs text-muted-foreground\">
                  Votre demande sera traitée dans les plus brefs délais.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}