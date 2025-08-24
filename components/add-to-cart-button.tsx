"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check, Loader2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/products"
import { cn } from "@/lib/utils"

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "secondary"
}

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  size = "default",
  variant = "default",
}: AddToCartButtonProps) {
  const { addItem, getItemQuantity } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const currentQuantity = getItemQuantity(product.id)
  const canAddMore = currentQuantity + quantity <= product.quantity

  const handleAddToCart = async () => {
    if (!product.inStock || !canAddMore) return

    setIsAdding(true)

    try {
      addItem(product, quantity)
      setJustAdded(true)

      // Reset estado después de 2 segundos
      setTimeout(() => {
        setJustAdded(false)
      }, 2000)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  if (!product.inStock) {
    return (
      <Button disabled className={cn(className)} size={size} variant={variant}>
        Agotado
      </Button>
    )
  }

  if (!canAddMore) {
    return (
      <Button disabled className={cn(className)} size={size} variant={variant}>
        Límite alcanzado
      </Button>
    )
  }

  if (justAdded) {
    return (
      <Button disabled className={cn("bg-green-600 hover:bg-green-600", className)} size={size}>
        <Check className="h-4 w-4 mr-2" />
        Agregado
      </Button>
    )
  }

  return (
    <Button onClick={handleAddToCart} disabled={isAdding} className={cn(className)} size={size} variant={variant}>
      {isAdding ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
      {isAdding ? "Agregando..." : "Agregar al Carrito"}
    </Button>
  )
}
