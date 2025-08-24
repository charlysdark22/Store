"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CartItemCard } from "@/components/cart-item-card"
import { EmptyCart } from "@/components/empty-cart"
import { useCart } from "@/contexts/cart-context"
import { ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const { items, totalItems, totalPrice, isLoading } = useCart()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (items.length === 0) {
    return <EmptyCart />
  }

  const shipping = 0 // Envío gratuito por ahora
  const tax = totalPrice * 0.1 // 10% de impuestos
  const finalTotal = totalPrice + shipping + tax

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Carrito de Compras</h1>
          <p className="text-muted-foreground">
            {totalItems} {totalItems === 1 ? "producto" : "productos"} en tu carrito
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items del carrito */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Resumen del Pedido
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} productos)</span>
                    <span>${totalPrice.toLocaleString()} CUP</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span className="text-green-600">Gratis</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Impuestos</span>
                    <span>${tax.toLocaleString()} CUP</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${finalTotal.toLocaleString()} CUP</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button size="lg" className="w-full" asChild>
                    <Link href="/checkout">
                      Proceder al Pago
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>

                  <Button variant="outline" size="lg" className="w-full bg-transparent" asChild>
                    <Link href="/productos">Continuar Comprando</Link>
                  </Button>
                </div>

                {/* Información adicional */}
                <div className="text-sm text-muted-foreground space-y-2 pt-4 border-t">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Envío gratuito en toda Cuba
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Garantía de 1 año en todos los productos
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Soporte técnico 24/7
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
