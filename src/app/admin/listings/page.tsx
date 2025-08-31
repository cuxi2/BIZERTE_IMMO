'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import { formatPrice } from '@/utils/price'
import { formatDate } from '@/lib/date'
import { Listing } from '@/types/db'
import { toast } from 'sonner'

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [purposeFilter, setPurposeFilter] = useState<string>('all')

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    setLoading(true)
    try {
      const query = supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error

      setListings(data || [])
    } catch (error) {
      toast.error('Erreur lors du chargement des biens')
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Bien supprimé avec succès')
      setListings(prev => prev.filter(l => l.id !== id))
    } catch (error) {
      toast.error('Erreur lors de la suppression')
      console.error('Error deleting listing:', error)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      toast.success('Statut mis à jour')
      setListings(prev => 
        prev.map(l => l.id === id ? { ...l, status: newStatus as string } : l)
      )
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
      console.error('Error updating status:', error)
    }
  }

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter
    const matchesPurpose = purposeFilter === 'all' || listing.purpose === purposeFilter
    
    return matchesSearch && matchesStatus && matchesPurpose
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'publie': return 'bg-green-100 text-green-800'
      case 'brouillon': return 'bg-gray-100 text-gray-800'
      case 'reserve': return 'bg-yellow-100 text-yellow-800'
      case 'occupe': return 'bg-red-100 text-red-800'
      case 'vendu': return 'bg-purple-100 text-purple-800'
      case 'retire': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Gestion des biens</h1>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau bien
          </Button>
        </div>
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
        <h1 className="text-3xl font-bold">Gestion des biens</h1>
        <Link href="/admin/listings/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau bien
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="brouillon">Brouillon</SelectItem>
                <SelectItem value="publie">Publié</SelectItem>
                <SelectItem value="reserve">Réservé</SelectItem>
                <SelectItem value="occupe">Occupé</SelectItem>
                <SelectItem value="vendu">Vendu</SelectItem>
                <SelectItem value="retire">Retiré</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={purposeFilter} onValueChange={setPurposeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les opérations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les opérations</SelectItem>
                <SelectItem value="vente">Vente</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="text-sm text-gray-500 flex items-center">
              {filteredListings.length} bien{filteredListings.length > 1 ? 's' : ''} trouvé{filteredListings.length > 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listings List */}
      <div className="space-y-4">
        {filteredListings.map((listing) => (
          <Card key={listing.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{listing.title}</h3>
                    <Badge className={getStatusColor(listing.status)}>
                      {listing.status}
                    </Badge>
                    <Badge variant="outline">
                      {listing.purpose}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Type:</span> {listing.kind}
                    </div>
                    <div>
                      <span className="font-medium">Ville:</span> {listing.city}
                    </div>
                    <div>
                      <span className="font-medium">Prix:</span> {formatPrice(listing.price, listing.currency)}
                    </div>
                    <div>
                      <span className="font-medium">Créé le:</span> {formatDate(listing.created_at)}
                    </div>
                    <div>
                      <span className="font-medium">Modifié le:</span> {formatDate(listing.updated_at)}
                    </div>
                    {listing.area_m2 && (
                      <div>
                        <span className="font-medium">Surface:</span> {listing.area_m2} m²
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {/* Status Quick Change */}
                  <Select
                    value={listing.status}
                    onValueChange={(value) => handleStatusChange(listing.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brouillon">Brouillon</SelectItem>
                      <SelectItem value="publie">Publié</SelectItem>
                      <SelectItem value="reserve">Réservé</SelectItem>
                      <SelectItem value="occupe">Occupé</SelectItem>
                      <SelectItem value="vendu">Vendu</SelectItem>
                      <SelectItem value="retire">Retiré</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Actions */}
                  <Link href={`/listing/${listing.slug}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  
                  <Link href={`/admin/listings/${listing.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(listing.id, listing.title)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredListings.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun bien trouvé
              </h3>
              <p className="text-gray-600 mb-4">
                {listings.length === 0 
                  ? "Commencez par ajouter votre premier bien immobilier."
                  : "Aucun bien ne correspond à vos critères de recherche."
                }
              </p>
              {listings.length === 0 && (
                <Link href="/admin/listings/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un bien
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}