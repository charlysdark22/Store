"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"

interface Product {
  id: string
  name: string
  name_en: string
  description: string | null
  price: number
  brand: string | null
  model: string | null
  images: string[]
  stock_quantity: number
  categories: {
    id: string
    name: string
    name_en: string
  } | null
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CU", {
      style: "currency",
      currency: "CUP",
    }).format(price)
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await addToCart(product.id)
    } finally {
      setIsAdding(false)
    }
  }

  const imageUrl =
    product.images?.[0] || `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(product.name)}`

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
          <Badge className="absolute top-2 left-2 bg-orange-500">Últimas unidades</Badge>
        )}
        {product.stock_quantity === 0 && <Badge className="absolute top-2 left-2 bg-red-500">Agotado</Badge>}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button asChild size="sm" className="bg-white text-black hover:bg-gray-100">
            <Link href={`/products/${product.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalles
            </Link>
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          {product.categories && (
            <Badge variant="secondary" className="text-xs">
              {product.categories.name}
            </Badge>
          )}
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          {product.brand && (
            <p className="text-sm text-gray-600">
              {product.brand} {product.model && `- ${product.model}`}
            </p>
          )}
          <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-blue-600">{formatPrice(product.price)}</span>
            <Button
              size="sm"
              disabled={product.stock_quantity === 0 || isAdding}
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isAdding ? "Agregando..." : product.stock_quantity === 0 ? "Agotado" : "Agregar"}
            </Button>
          </div>
          <div className="text-xs text-gray-500">
            {product.stock_quantity > 0 ? `${product.stock_quantity} disponibles` : "Sin stock"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
