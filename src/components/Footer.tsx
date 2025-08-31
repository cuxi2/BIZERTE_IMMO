import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg">MEFTAHI IMMO</h3>
            <p className="text-sm text-muted-foreground">
              Votre partenaire immobilier de confiance à Bizerte depuis plus de 10 ans.
            </p>
            <div className="space-y-1 text-sm">
              <p>📍 Bizerte, Tunisie</p>
              <p>📞 {process.env.COMPANY_PHONE || '+216 XX XXX XXX'}</p>
              <p>✉️ contact@meftahi-immo.tn</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold">Navigation</h4>
            <div className="space-y-2 text-sm">
              <Link href="/catalog" className="block hover:text-primary transition-colors">
                Catalogue
              </Link>
              <Link href="/catalog?purpose=vente" className="block hover:text-primary transition-colors">
                Acheter
              </Link>
              <Link href="/catalog?purpose=location" className="block hover:text-primary transition-colors">
                Louer
              </Link>
              <Link href="/contact" className="block hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Property Types */}
          <div className="space-y-3">
            <h4 className="font-semibold">Types de biens</h4>
            <div className="space-y-2 text-sm">
              <Link href="/catalog?kind=appartement" className="block hover:text-primary transition-colors">
                Appartements
              </Link>
              <Link href="/catalog?kind=villa" className="block hover:text-primary transition-colors">
                Villas
              </Link>
              <Link href="/catalog?kind=studio" className="block hover:text-primary transition-colors">
                Studios
              </Link>
              <Link href="/catalog?kind=terrain" className="block hover:text-primary transition-colors">
                Terrains
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="font-semibold">Informations légales</h4>
            <div className="space-y-2 text-sm">
              <Link href="/mentions-legales" className="block hover:text-primary transition-colors">
                Mentions légales
              </Link>
              <Link href="/confidentialite" className="block hover:text-primary transition-colors">
                Confidentialité
              </Link>
              <Link href="/conditions" className="block hover:text-primary transition-colors">
                Conditions d&apos;utilisation
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {currentYear} MEFTAHI IMMO. Tous droits réservés.</p>
          <p>Développé avec ❤️ pour l&apos;immobilier tunisien</p>
        </div>
      </div>
    </footer>
  )
}