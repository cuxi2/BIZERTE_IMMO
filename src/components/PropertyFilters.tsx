'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Search } from 'lucide-react'
import { ListingFilters, PropertyKind, ListingPurpose } from '@/types/db'

interface PropertyFiltersProps {
  filters: ListingFilters
  onFiltersChange: (filters: ListingFilters) => void
  onSearch: () => void
  isLoading?: boolean
}

export default function PropertyFilters({ 
  filters, 
  onFiltersChange, 
  onSearch, 
  isLoading = false 
}: PropertyFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ListingFilters>(filters)

  const handleFilterChange = (key: keyof ListingFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilter = (key: keyof ListingFilters) => {
    const newFilters = { ...localFilters }
    delete newFilters[key]
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    setLocalFilters({})
    onFiltersChange({})
  }

  const activeFiltersCount = Object.values(localFilters).filter(Boolean).length

  return (
    <div className="bg-white border rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filtres de recherche</h3>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Effacer tout ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Active filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {localFilters.purpose && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {localFilters.purpose}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('purpose')}
              />
            </Badge>
          )}
          {localFilters.kind && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {localFilters.kind}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('kind')}
              />
            </Badge>
          )}
          {localFilters.city && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {localFilters.city}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('city')}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Filter inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Purpose */}
        <div>
          <label className="text-sm font-medium mb-2 block">Type d'opération</label>
          <Select 
            value={localFilters.purpose || ''} 
            onValueChange={(value: ListingPurpose) => handleFilterChange('purpose', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Vente ou location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vente">Vente</SelectItem>
              <SelectItem value="location">Location</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Kind */}
        <div>
          <label className="text-sm font-medium mb-2 block">Type de bien</label>
          <Select 
            value={localFilters.kind || ''} 
            onValueChange={(value: PropertyKind) => handleFilterChange('kind', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="appartement">Appartement</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="terrain">Terrain</SelectItem>
              <SelectItem value="bureau">Bureau</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* City */}
        <div>
          <label className="text-sm font-medium mb-2 block">Ville</label>
          <Input
            placeholder="Ex: Bizerte"
            value={localFilters.city || ''}
            onChange={(e) => handleFilterChange('city', e.target.value)}
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="text-sm font-medium mb-2 block">Prix minimum</label>
          <Input
            type="number"
            placeholder="0"
            value={localFilters.min_price || ''}
            onChange={(e) => handleFilterChange('min_price', Number(e.target.value) || undefined)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Prix maximum</label>
          <Input
            type="number"
            placeholder="Sans limite"
            value={localFilters.max_price || ''}
            onChange={(e) => handleFilterChange('max_price', Number(e.target.value) || undefined)}
          />
        </div>

        {/* Bedrooms */}
        <div>
          <label className="text-sm font-medium mb-2 block">Chambres</label>
          <Select 
            value={localFilters.bedrooms?.toString() || ''} 
            onValueChange={(value) => handleFilterChange('bedrooms', value ? Number(value) : undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Nombre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Area Range */}
        <div>
          <label className="text-sm font-medium mb-2 block">Surface min (m²)</label>
          <Input
            type="number"
            placeholder="0"
            value={localFilters.min_area || ''}
            onChange={(e) => handleFilterChange('min_area', Number(e.target.value) || undefined)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Surface max (m²)</label>
          <Input
            type="number"
            placeholder="Sans limite"
            value={localFilters.max_area || ''}
            onChange={(e) => handleFilterChange('max_area', Number(e.target.value) || undefined)}
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="pt-4 border-t">
        <Button 
          onClick={onSearch} 
          disabled={isLoading}
          className="w-full"
        >
          <Search className="h-4 w-4 mr-2" />
          {isLoading ? 'Recherche...' : 'Rechercher'}
        </Button>
      </div>
    </div>
  )
}