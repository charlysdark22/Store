import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { getFeaturedProducts } from "@/lib/products"

export function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts()

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Productos Destacados</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Los productos más populares y mejor valorados por nuestros clientes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <Link href={`/producto/${product.slug}`}>
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  {product.comparePrice && (
                    <Badge className="absolute top-3 left-3" variant="destructive">
                      -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                    </Badge>
                  )}
                  {product.isNew && <Badge className="absolute top-3 right-3">Nuevo</Badge>}
                </div>

                <div className="p-4 space-y-3">
                  <div className="text-sm text-muted-foreground">{product.category}</div>

                  <Link href={`/producto/${product.slug}`}>
                    <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium ml-1">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviewCount} reseñas)</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">${product.price.toLocaleString()} CUP</span>
                    {product.comparePrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.comparePrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button className="w-full" size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Agregar al Carrito
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
