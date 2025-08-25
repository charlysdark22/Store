"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react"
import Image from "next/image"
import { ProductCard } from "./product-card"
import { useCart } from "@/contexts/cart-context"

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
  specifications: any
  categories: {
    id: string
    name: string
    name_en: string
  } | null
}

interface ProductDetailProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CU", {
      style: "currency",
      currency: "CUP",
    }).format(price)
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await addToCart(product.id, quantity)
    } finally {
      setIsAdding(false)
    }
  }

  const images =
    product.images?.length > 0
      ? product.images
      : [`/placeholder.svg?height=600&width=600&query=${encodeURIComponent(product.name)}`]

  const specifications = product.specifications || {}

  return (
    <div className="space-y-8">
      {/* Producto principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Galería de imágenes */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-md border-2 ${
                    selectedImage === index ? "border-blue-600" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            {product.categories && (
              <Badge variant="secondary" className="mb-2">
                {product.categories.name}
              </Badge>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            {product.brand && (
              <p className="text-lg text-gray-600">
                {product.brand} {product.model && `- ${product.model}`}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-bold text-blue-600">{formatPrice(product.price)}</div>
            <div className="flex items-center gap-4">
              {product.stock_quantity > 0 ? (
                <Badge className="bg-green-100 text-green-800">{product.stock_quantity} disponibles</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800">Agotado</Badge>
              )}
            </div>
          </div>

          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Especificaciones */}
          {Object.keys(specifications).length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Especificaciones</h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium capitalize">{key.replace("_", " ")}</span>
                    <span className="text-gray-600">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Controles de compra */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Cantidad:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  disabled={quantity >= product.stock_quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={product.stock_quantity === 0 || isAdding}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isAdding ? "Agregando..." : product.stock_quantity === 0 ? "Agotado" : "Agregar al Carrito"}
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
