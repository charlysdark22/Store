"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, Share2, Minus, Plus } from "lucide-react"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/products"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { getItemQuantity } = useCart()

  const currentInCart = getItemQuantity(product.id)
  const maxQuantity = product.quantity - currentInCart

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Galería de imágenes */}
      <div className="space-y-4">
        <div className="aspect-square overflow-hidden rounded-lg border">
          <img
            src={product.images[selectedImage] || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                  selectedImage === index ? "border-primary" : "border-muted"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
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
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{product.category}</Badge>
            {product.isNew && <Badge>Nuevo</Badge>}
            {!product.inStock && <Badge variant="destructive">Agotado</Badge>}
          </div>

          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                  }`}
                />
              ))}
              <span className="ml-2 font-medium">{product.rating}</span>
            </div>
            <span className="text-muted-foreground">({product.reviewCount} reseñas)</span>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <span className="text-3xl font-bold">${product.price.toLocaleString()} CUP</span>
            {product.comparePrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  ${product.comparePrice.toLocaleString()}
                </span>
                <Badge variant="destructive">
                  -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                </Badge>
              </>
            )}
          </div>

          <p className="text-muted-foreground mb-6">{product.shortDescription}</p>
        </div>

        {/* Controles de compra */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="font-medium">Cantidad:</span>
            <div className="flex items-center border rounded-lg">
              <Button variant="ghost" size="sm" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= maxQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">
              {maxQuantity} disponibles
              {currentInCart > 0 && ` (${currentInCart} en carrito)`}
            </span>
          </div>

          <div className="flex space-x-4">
            <AddToCartButton product={product} quantity={quantity} size="lg" className="flex-1" />
            <Button variant="outline" size="lg">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Información adicional */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">SKU:</span> {product.sku}
              </div>
              <div>
                <span className="font-medium">Marca:</span> {product.brand}
              </div>
              <div>
                <span className="font-medium">Modelo:</span> {product.model}
              </div>
              <div>
                <span className="font-medium">Stock:</span> {product.quantity} unidades
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs con información detallada */}
      <div className="lg:col-span-2 mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Descripción</TabsTrigger>
            <TabsTrigger value="specifications">Especificaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Descripción del Producto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Especificaciones Técnicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-muted">
                      <span className="font-medium">{key}:</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
