'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save } from 'lucide-react'
import { toSlug } from '@/lib/slug'
import { CreateListingData, PropertyKind, ListingPurpose, ListingStatus } from '@/types/db'
import { toast } from 'sonner'
import Link from 'next/link'

export default function NewListingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateListingData>({
    title: '',
    description: '',
    purpose: 'location',
    kind: 'appartement',
    price: 0,
    currency: 'TND',
    address: '',
    city: 'Bizerte',
    bedrooms: undefined,
    bathrooms: undefined,
    area_m2: undefined,
    year_built: undefined,
    status: 'brouillon'
  })

  const handleInputChange = (field: keyof CreateListingData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.title.trim()) {
        throw new Error('Le titre est requis')
      }

      if (formData.price <= 0) {
        throw new Error('Le prix doit être supérieur à 0')
      }

      // Generate slug
      const slug = toSlug(formData.title)

      // Check if slug exists
      const { data: existingListing } = await supabase
        .from('listings')
        .select('id')
        .eq('slug', slug)
        .single()

      let finalSlug = slug
      if (existingListing) {
        finalSlug = `${slug}-${Date.now()}`
      }

      // Create listing
      const { data, error } = await supabase
        .from('listings')
        .insert([{
          ...formData,
          slug: finalSlug
        }])
        .select()
        .single()

      if (error) throw error

      toast.success('Bien créé avec succès')
      router.push(`/admin/listings/${data.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/listings">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Nouveau bien immobilier</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Appartement moderne avec vue mer"
                  required
                />
              </div>

              <div>
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Bizerte"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Avenue Habib Bourguiba"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez le bien en détail..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Détails du bien</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="purpose">Type d'opération *</Label>
                <Select
                  value={formData.purpose}
                  onValueChange={(value: ListingPurpose) => handleInputChange('purpose', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vente">Vente</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="kind">Type de bien *</Label>
                <Select
                  value={formData.kind}
                  onValueChange={(value: PropertyKind) => handleInputChange('kind', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bedrooms">Chambres</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  value={formData.bedrooms || ''}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>

              <div>
                <Label htmlFor="bathrooms">Salles de bain</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  value={formData.bathrooms || ''}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>

              <div>
                <Label htmlFor="area_m2">Surface (m²)</Label>
                <Input
                  id="area_m2"
                  type="number"
                  min="0"
                  value={formData.area_m2 || ''}
                  onChange={(e) => handleInputChange('area_m2', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="year_built">Année de construction</Label>
              <Input
                id="year_built"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.year_built || ''}
                onChange={(e) => handleInputChange('year_built', e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Status */}
        <Card>
          <CardHeader>
            <CardTitle>Prix et statut</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Prix *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="currency">Devise</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleInputChange('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TND">TND (Dinar Tunisien)</SelectItem>
                    <SelectItem value="EUR">EUR (Euro)</SelectItem>
                    <SelectItem value="USD">USD (Dollar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ListingStatus) => handleInputChange('status', value)}
              >
                <SelectTrigger>
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
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/listings">
            <Button variant="outline" type="button">
              Annuler
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>Création...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Créer le bien
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}