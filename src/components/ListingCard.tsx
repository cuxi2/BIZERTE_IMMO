import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/utils/price'
import { Listing } from '@/types/db'

interface ListingCardProps {
  listing: Listing
  className?: string
}

export default function ListingCard({ listing, className = '' }: ListingCardProps) {
  const purposeColor = listing.purpose === 'vente' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
  const statusColor = {
    'publie': 'bg-green-100 text-green-800',
    'brouillon': 'bg-gray-100 text-gray-800',
    'reserve': 'bg-yellow-100 text-yellow-800',
    'occupe': 'bg-red-100 text-red-800',
    'vendu': 'bg-purple-100 text-purple-800',
    'retire': 'bg-gray-100 text-gray-800'
  }

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <div className="relative">
        <img 
          src={listing.main_image_url || '/placeholder.jpg'} 
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge className={purposeColor}>
            {listing.purpose}
          </Badge>
          <Badge className={statusColor[listing.status]}>
            {listing.status}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {listing.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-2">
          {listing.city} • {listing.kind}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <p className="text-lg font-bold text-primary">
            {formatPrice(listing.price, listing.currency)}
          </p>
          {listing.area_m2 && (
            <p className="text-sm text-muted-foreground">
              {listing.area_m2} m²
            </p>
          )}
        </div>
        
        {(listing.bedrooms || listing.bathrooms) && (
          <div className="flex gap-4 text-sm text-muted-foreground mb-3">
            {listing.bedrooms && (
              <span>🛏 {listing.bedrooms} ch.</span>
            )}
            {listing.bathrooms && (
              <span>🚿 {listing.bathrooms} sdb.</span>
            )}
          </div>
        )}
        
        <Link 
          href={`/listing/${listing.slug}`}
          className="inline-flex items-center text-primary hover:underline font-medium"
        >
          Voir les détails →
        </Link>
      </CardContent>
    </Card>
  )
}