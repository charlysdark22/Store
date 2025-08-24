import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowRight } from "lucide-react"

export function EmptyCart() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
            <p className="text-muted-foreground mb-8">
              Parece que aún no has agregado ningún producto a tu carrito. ¡Explora nuestro catálogo y encuentra lo que
              necesitas!
            </p>
          </div>

          <div className="space-y-4">
            <Button size="lg" className="w-full" asChild>
              <Link href="/productos">
                Explorar Productos
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" asChild>
                <Link href="/categoria/computadoras-escritorio">Computadoras</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/categoria/laptops">Laptops</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/categoria/telefonos">Teléfonos</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/categoria/accesorios-pc">Accesorios</Link>
              </Button>
            </div>
          </div>

          {/* Beneficios */}
          <div className="mt-12 text-sm text-muted-foreground space-y-2">
            <div className="flex items-center justify-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Envío gratuito en toda Cuba
            </div>
            <div className="flex items-center justify-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Garantía de 1 año
            </div>
            <div className="flex items-center justify-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Soporte técnico 24/7
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
