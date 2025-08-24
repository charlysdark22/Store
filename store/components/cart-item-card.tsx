"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, Heart } from "lucide-react"
import { useCart, type CartItem } from "@/contexts/cart-context"

interface CartItemCardProps {
  item: CartItem
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantityChange = async (newQuantity: number) => {
    setIsUpdating(true)
    updateQuantity(item.id, newQuantity)
    // Simular delay para UX
    setTimeout(() => setIsUpdating(false), 300)
  }

  const handleRemove = () => {
    removeItem(item.id)
  }

  const itemTotal = item.price * item.quantity
  const hasDiscount = item.product.comparePrice && item.product.comparePrice > item.price

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Imagen del producto */}
          <div className="flex-shrink-0">
            <Link href={`/producto/${item.product.slug}`}>
              <div className="w-24 h-24 rounded-lg overflow-hidden border">
                <img
                  src={item.product.images[0] || "/placeholder.svg"}
                  alt={item.product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            </Link>
          </div>

          {/* Información del producto */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <Link href={`/producto/${item.product.slug}`}>
                  <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground">{item.product.category}</p>
                <p className="text-sm text-muted-foreground">SKU: {item.product.sku}</p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Precio y controles */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold">${item.price.toLocaleString()} CUP</span>
                {hasDiscount && (
                  <>
                    <span className="text-sm text-muted-foreground line-through">
                      ${item.product.comparePrice?.toLocaleString()}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      -{Math.round(((item.product.comparePrice! - item.price) / item.product.comparePrice!) * 100)}%
                    </Badge>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                {/* Control de cantidad */}
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={item.quantity <= 1 || isUpdating}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                    {isUpdating ? "..." : item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={item.quantity >= item.product.quantity || isUpdating}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Total del item */}
                <div className="text-right">
                  <div className="font-bold text-lg">${itemTotal.toLocaleString()} CUP</div>
                  <div className="text-xs text-muted-foreground">
                    {item.product.quantity - item.quantity} disponibles
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones adicionales */}
            <div className="flex items-center gap-2 mt-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Heart className="h-4 w-4 mr-1" />
                Guardar para después
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
