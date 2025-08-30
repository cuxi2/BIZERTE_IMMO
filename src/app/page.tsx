import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Home, MapPin, Star } from 'lucide-react'

export default function HomePage() {
  const propertyTypes = [
    {
      name: 'Appartements',
      key: 'appartement',
      icon: Building2,
      description: 'Découvrez nos appartements modernes en centre-ville et quartiers résidentiels.',
      count: '150+ biens'
    },
    {
      name: 'Villas',
      key: 'villa', 
      icon: Home,
      description: 'Villas familiales avec jardins dans les meilleurs quartiers de Bizerte.',
      count: '75+ biens'
    },
    {
      name: 'Studios',
      key: 'studio',
      icon: Building2,
      description: 'Studios pratiques et bien situés, parfaits pour jeunes actifs.',
      count: '80+ biens'
    }
  ]

  const features = [
    {
      title: 'Expertise locale',
      description: 'Plus de 10 ans d\'expérience sur le marché immobilier de Bizerte',
      icon: MapPin
    },
    {
      title: 'Service premium',
      description: 'Accompagnement personnalisé de la recherche à la signature',
      icon: Star
    },
    {
      title: 'Portefeuille varié',
      description: 'Large sélection de biens pour tous budgets et besoins',
      icon: Building2
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            🏡 Votre partenaire immobilier à Bizerte
          </Badge>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gray-900">
            MEFTAHI IMMO
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Vente & Location de biens immobiliers à Bizerte – 
            Appartements, Villas, Studios et plus encore
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/catalog">
              <Button size="lg" className="w-full sm:w-auto">
                🔍 Voir le catalogue
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                👤 Espace Admin
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Nos types de biens</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explorez notre large gamme de propriétés disponibles à la vente et à la location
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {propertyTypes.map((type) => {
              const IconComponent = type.icon
              return (
                <Card key={type.key} className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                      <IconComponent className="h-8 w-8" />
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">{type.name}</h3>
                    <p className="text-gray-600 mb-4">{type.description}</p>
                    <Badge variant="secondary" className="mb-4">{type.count}</Badge>
                    
                    <Link 
                      href={`/catalog?kind=${type.key}`}
                      className="inline-flex items-center text-primary hover:underline font-medium"
                    >
                      Explorer → 
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Pourquoi choisir MEFTAHI IMMO ?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une agence de confiance au service de vos projets immobiliers
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Prêt à trouver votre bien idéal ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Parcourez notre catalogue ou contactez-nous pour un accompagnement personnalisé
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/catalog">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Parcourir le catalogue
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-primary">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
