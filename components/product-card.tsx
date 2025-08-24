import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Eye } from "lucide-react"
import { AddToCartButton } from "@/components/add-to-cart-button"
import type { Product } from "@/lib/products"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <Link href={`/producto/${product.slug}`}>
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && <Badge variant="default">Nuevo</Badge>}
            {product.comparePrice && (
              <Badge variant="destructive">
                -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
              </Badge>
            )}
            {!product.inStock && <Badge variant="secondary">Agotado</Badge>}
          </div>

          {/* Quick actions */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary" asChild>
              <Link href={`/producto/${product.slug}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="text-sm text-muted-foreground">{product.category}</div>

          <Link href={`/producto/${product.slug}`}>
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</p>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium ml-1">{product.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
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
        <AddToCartButton product={product} className="w-full" size="sm" />
      </CardFooter>
    </Card>
  )
}
