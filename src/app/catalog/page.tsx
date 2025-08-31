'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import ListingCard from '@/components/ListingCard'
import PropertyFilters from '@/components/PropertyFilters'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Listing, ListingFilters, PropertyKind } from '@/types/db'

function CatalogContent() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ListingFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  
  const searchParams = useSearchParams()
  const itemsPerPage = 12

  // Initialize filters from URL params
  useEffect(() => {
    const initialFilters: ListingFilters = {}
    
    const purpose = searchParams.get('purpose')
    const kind = searchParams.get('kind')
    const city = searchParams.get('city')
    
    if (purpose && (purpose === 'vente' || purpose === 'location')) {
      initialFilters.purpose = purpose
    }
    if (kind) {
      initialFilters.kind = kind as PropertyKind
    }
    if (city) {
      initialFilters.city = city
    }
    
    setFilters(initialFilters)
  }, [searchParams])

  // Fetch listings based on filters
  const fetchListings = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      let query = supabase
        .from('listings')
        .select('*', { count: 'exact' })
        .eq('status', 'publie')
        .order('created_at', { ascending: false })
      
      // Apply filters
      if (filters.purpose) {
        query = query.eq('purpose', filters.purpose)
      }
      if (filters.kind) {
        query = query.eq('kind', filters.kind)
      }
      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`)
      }
      if (filters.min_price) {
        query = query.gte('price', filters.min_price)
      }
      if (filters.max_price) {
        query = query.lte('price', filters.max_price)
      }
      if (filters.bedrooms) {
        query = query.eq('bedrooms', filters.bedrooms)
      }
      if (filters.bathrooms) {
        query = query.eq('bathrooms', filters.bathrooms)
      }
      if (filters.min_area) {
        query = query.gte('area_m2', filters.min_area)
      }
      if (filters.max_area) {
        query = query.lte('area_m2', filters.max_area)
      }
      
      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage
      const to = from + itemsPerPage - 1
      query = query.range(from, to)
      
      const { data, error, count } = await query
      
      if (error) throw error
      
      setListings(data || [])
      setTotalCount(count || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }, [filters, currentPage])

  // Fetch listings when filters or page change
  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  const handleFiltersChange = (newFilters: ListingFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleSearch = () => {
    fetchListings()
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Catalogue immobilier</h1>
        <p className="text-muted-foreground">
          Découvrez nos {totalCount} biens disponibles à Bizerte et ses environs
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <PropertyFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
            isLoading={loading}
          />
        </div>

        {/* Listings Grid */}
        <div className="lg:col-span-3">
          {error && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: itemsPerPage }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <AlertCircle className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Aucun bien trouvé</h3>
              <p className="text-muted-foreground mb-4">
                Essayez de modifier vos critères de recherche pour voir plus de résultats.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setFilters({})
                  setCurrentPage(1)
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  {totalCount} bien{totalCount > 1 ? 's' : ''} trouvé{totalCount > 1 ? 's' : ''}
                  {totalPages > 1 && ` - Page ${currentPage} sur ${totalPages}`}
                </p>
              </div>

              {/* Listings Grid */}
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Précédent
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === totalPages || 
                      Math.abs(page - currentPage) <= 2
                    )
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-muted-foreground">...</span>
                        )}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      </div>
                    ))}
                  
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Chargement...</div>}>
      <CatalogContent />
    </Suspense>
  )
}