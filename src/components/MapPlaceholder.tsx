import { MapPin } from 'lucide-react'

interface MapPlaceholderProps {
  address?: string
  city?: string
  latitude?: number
  longitude?: number
  className?: string
}

export default function MapPlaceholder({ 
  address, 
  city, 
  latitude, 
  longitude, 
  className = '' 
}: MapPlaceholderProps) {
  const hasCoordinates = latitude && longitude

  return (
    <div className={`bg-gray-100 border rounded-xl p-8 ${className}`}>
      <div className="text-center">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">Localisation</h3>
        
        {address && (
          <p className="text-muted-foreground mb-1">{address}</p>
        )}
        
        {city && (
          <p className="text-muted-foreground mb-4">{city}</p>
        )}
        
        {hasCoordinates ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Coordonnées: {latitude}, {longitude}
            </p>
            
            {/* Google Maps Link */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Voir sur Google Maps
            </a>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Carte interactive disponible prochainement
          </p>
        )}
      </div>
    </div>
  )
}