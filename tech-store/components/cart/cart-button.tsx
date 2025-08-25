"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"

export function CartButton() {
  const { totalItems, isLoading } = useCart()

  return (
    <Button asChild variant="ghost" className="relative">
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {!isLoading && totalItems > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600">
            {totalItems > 99 ? "99+" : totalItems}
          </Badge>
        )}
      </Link>
    </Button>
  )
}
