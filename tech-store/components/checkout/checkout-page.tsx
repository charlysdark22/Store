"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { PaymentMethods } from "./payment-methods"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ShippingInfo {
  fullName: string
  phone: string
  address: string
  city: string
  province: string
  notes: string
}

export function CheckoutPage() {
  const { items, totalPrice, isLoading } = useCart()
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    notes: "",
  })
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"transfermovil" | "enzona" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CU", {
      style: "currency",
      currency: "CUP",
    }).format(price)
  }

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid = () => {
    return (
      shippingInfo.fullName &&
      shippingInfo.phone &&
      shippingInfo.address &&
      shippingInfo.city &&
      shippingInfo.province &&
      selectedPaymentMethod
    )
  }

  const handleProceedToPayment = () => {
    if (!isFormValid()) return

    setIsProcessing(true)
    // Redirigir a la página de pago con la información
    const queryParams = new URLSearchParams({
      paymentMethod: selectedPaymentMethod!,
      total: totalPrice.toString(),
      shippingInfo: JSON.stringify(shippingInfo),
    })
    router.push(`/payment?${queryParams.toString()}`)
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8">Agrega algunos productos para continuar</p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/products">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Ir a Productos
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/cart" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al Carrito
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Compra</h1>
        <p className="text-gray-600">Completa tu información para procesar el pedido</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario de envío */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información de envío */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Envío</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Nombre Completo *</Label>
                  <Input
                    id="fullName"
                    value={shippingInfo.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    value={shippingInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+53 5555 5555"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  value={shippingInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Calle, número, apartamento"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    value={shippingInfo.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Tu ciudad"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="province">Provincia *</Label>
                  <Input
                    id="province"
                    value={shippingInfo.province}
                    onChange={(e) => handleInputChange("province", e.target.value)}
                    placeholder="Tu provincia"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                <Textarea
                  id="notes"
                  value={shippingInfo.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Instrucciones especiales para la entrega"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Métodos de pago */}
          <PaymentMethods selectedMethod={selectedPaymentMethod} onMethodSelect={setSelectedPaymentMethod} />
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Lista de productos */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
                onClick={handleProceedToPayment}
                disabled={!isFormValid() || isProcessing}
              >
                {isProcessing ? "Procesando..." : "Continuar al Pago"}
              </Button>

              <p className="text-xs text-gray-500 text-center">Al continuar, aceptas nuestros términos y condiciones</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
