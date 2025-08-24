import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">TC</span>
              </div>
              <span className="font-bold text-xl">TechStore</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Tu tienda de confianza para tecnología en Cuba. Productos de calidad con garantía y soporte técnico.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/productos" className="text-muted-foreground hover:text-primary">
                  Todos los Productos
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="text-muted-foreground hover:text-primary">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/marcas" className="text-muted-foreground hover:text-primary">
                  Marcas
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">Atención al Cliente</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ayuda" className="text-muted-foreground hover:text-primary">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/garantia" className="text-muted-foreground hover:text-primary">
                  Garantía
                </Link>
              </li>
              <li>
                <Link href="/envios" className="text-muted-foreground hover:text-primary">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="text-muted-foreground hover:text-primary">
                  Devoluciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contacto</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">+53 5555-5555</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">info@techstore.cu</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">La Habana, Cuba</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© 2024 TechStore Cuba. Todos los derechos reservados.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacidad" className="text-sm text-muted-foreground hover:text-primary">
              Política de Privacidad
            </Link>
            <Link href="/terminos" className="text-sm text-muted-foreground hover:text-primary">
              Términos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
