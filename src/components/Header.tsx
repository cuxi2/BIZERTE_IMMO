import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu'

export default function Header() {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <span className="font-bold text-lg">MI</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-xl">MEFTAHI IMMO</h1>
              <p className="text-xs text-muted-foreground">Bizerte • Tunisie</p>
            </div>
          </Link>

          {/* Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex space-x-6">
              <NavigationMenuItem>
                <Link href="/catalog" className="text-sm font-medium hover:text-primary transition-colors">
                  Catalogue
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/catalog?purpose=vente" className="text-sm font-medium hover:text-primary transition-colors">
                  Vente
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/catalog?purpose=location" className="text-sm font-medium hover:text-primary transition-colors">
                  Location
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Connexion
              </Button>
            </Link>
            <Link href="/catalog">
              <Button size="sm">
                Rechercher
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t bg-gray-50">
        <div className="container mx-auto px-4 py-2">
          <div className="flex space-x-4 overflow-x-auto">
            <Link href="/catalog" className="text-sm font-medium whitespace-nowrap py-1 px-2 rounded hover:bg-white">
              Catalogue
            </Link>
            <Link href="/catalog?purpose=vente" className="text-sm font-medium whitespace-nowrap py-1 px-2 rounded hover:bg-white">
              Vente
            </Link>
            <Link href="/catalog?purpose=location" className="text-sm font-medium whitespace-nowrap py-1 px-2 rounded hover:bg-white">
              Location
            </Link>
            <Link href="/contact" className="text-sm font-medium whitespace-nowrap py-1 px-2 rounded hover:bg-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}