"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"

interface CartItemProps {
  item: {
    id: string
    product_id: string
    quantity: number
    product: {
      id: string
      name: string
      price: number
      images: string[]
      stock_quantity: number
      brand: string | null
      model: string | null
    }
  }
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CU", {
      style: "currency",
      currency: "CUP",
    }).format(price)
  }

  const imageUrl =
    item.product.images?.[0] || `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(item.product.name)}`
  const totalPrice = item.product.price * item.quantity

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Imagen del producto */}
          <div className="flex-shrink-0">
            <Link href={`/products/${item.product.id}`}>
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={item.product.name}
                width={100}
                height={100}
                className="rounded-md object-cover hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>

          {/* Información del producto */}
          <div className="flex-1 space-y-2">
            <div>
              <Link
                href={`/products/${item.product.id}`}
                className="font-semibold text-lg hover:text-blue-600 transition-colors"
              >
                {item.product.name}
              </Link>
              {item.product.brand && (
                <p className="text-sm text-gray-600">
                  {item.product.brand} {item.product.model && `- ${item.product.model}`}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Cantidad:</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-3 py-1 min-w-[2.5rem] text-center">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock_quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">{formatPrice(totalPrice)}</div>
                <div className="text-sm text-gray-500">{formatPrice(item.product.price)} c/u</div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                {item.product.stock_quantity > 0 ? `${item.product.stock_quantity} disponibles` : "Sin stock"}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
