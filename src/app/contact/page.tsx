import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nous contacter</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une question ? Un projet immobilier ? Notre équipe est à votre disposition 
            pour vous accompagner dans toutes vos démarches.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Envoyez-nous un message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Prénom" />
                <Input placeholder="Nom" />
              </div>
              
              <Input placeholder="Email" type="email" />
              <Input placeholder="Téléphone" type="tel" />
              
              <Input placeholder="Sujet" />
              
              <Textarea 
                placeholder="Votre message..."
                className="min-h-[120px]"
              />
              
              <Button className="w-full">
                Envoyer le message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Office Info */}
            <Card>
              <CardHeader>
                <CardTitle>Nos coordonnées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-muted-foreground">
                      Avenue Habib Bourguiba<br />
                      7000 Bizerte, Tunisie
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-muted-foreground">
                      {process.env.COMPANY_PHONE || '+216 XX XXX XXX'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">contact@meftahi-immo.tn</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opening Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horaires d&apos;ouverture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Lundi - Vendredi</span>
                  <span className="font-medium">8h30 - 17h30</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi</span>
                  <span className="font-medium">9h00 - 13h00</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Dimanche</span>
                  <span>Fermé</span>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Nos services</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Vente de biens immobiliers</li>
                  <li>• Location saisonnière et longue durée</li>
                  <li>• Estimation gratuite de votre bien</li>
                  <li>• Accompagnement juridique</li>
                  <li>• Gestion locative</li>
                  <li>• Conseil en investissement</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-0">
              <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Plan interactif bientôt disponible</p>
                  <p className="text-sm text-muted-foreground">Avenue Habib Bourguiba, Bizerte</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}