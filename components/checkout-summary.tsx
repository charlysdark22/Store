import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Truck, Shield } from "lucide-react"
import type { CartItem } from "@/contexts/cart-context"

interface CheckoutSummaryProps {
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  isProcessing?: boolean
}

export function CheckoutSummary({ items, subtotal, shipping, tax, total, isProcessing }: CheckoutSummaryProps) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingBag className="h-5 w-5 mr-2" />
          Resumen del Pedido
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Items del pedido */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden border flex-shrink-0">
                <img
                  src={item.product.images[0] || "/placeholder.svg"}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Qty: {item.quantity}</span>
                  <span className="font-medium">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Cálculos */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} productos)</span>
            <span>${subtotal.toLocaleString()} CUP</span>
          </div>

          <div className="flex justify-between">
            <span>Envío</span>
            <span className="text-green-600">{shipping === 0 ? "Gratis" : `$${shipping.toLocaleString()} CUP`}</span>
          </div>

          <div className="flex justify-between">
            <span>Impuestos</span>
            <span>${tax.toLocaleString()} CUP</span>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${total.toLocaleString()} CUP</span>
          </div>
        </div>

        {/* Información adicional */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            <Truck className="h-4 w-4 mr-2 text-green-600" />
            Envío gratuito en toda Cuba
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Shield className="h-4 w-4 mr-2 text-blue-600" />
            Garantía de 1 año incluida
          </div>
        </div>

        {/* Estado de procesamiento */}
        {isProcessing && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Procesando tu pedido...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
