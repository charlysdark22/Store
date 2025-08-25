"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { QRCodeDisplay } from "./qr-code-display"
import { ArrowLeft, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useCart } from "@/contexts/cart-context"

interface PaymentInfo {
  referenceNumber: string
  bankAccount: string
  notes: string
}

export function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    referenceNumber: "",
    bankAccount: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutos en segundos

  const paymentMethod = searchParams.get("paymentMethod") as "transfermovil" | "enzona"
  const total = Number.parseFloat(searchParams.get("total") || "0")
  const shippingInfo = JSON.parse(searchParams.get("shippingInfo") || "{}")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CU", {
      style: "currency",
      currency: "CUP",
    }).format(price)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Contador regresivo
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/cart")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleInputChange = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmitPayment = async () => {
    if (!paymentInfo.referenceNumber || !paymentInfo.bankAccount) return

    setIsSubmitting(true)
    const supabase = createClient()

    try {
      // Obtener usuario actual
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuario no autenticado")

      // Crear el pedido
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: total,
          payment_method: paymentMethod,
          payment_status: "pending",
          shipping_address: shippingInfo,
          notes: `Referencia: ${paymentInfo.referenceNumber} | Cuenta: ${paymentInfo.bankAccount} | Notas: ${paymentInfo.notes}`,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Crear los items del pedido
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)
      if (itemsError) throw itemsError

      // Limpiar carrito
      await clearCart()

      // Redirigir a página de confirmación
      router.push(`/order-confirmation/${order.id}`)
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Error al procesar el pedido. Por favor, intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    return paymentInfo.referenceNumber && paymentInfo.bankAccount
  }

  if (!paymentMethod || !total) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Información de pago no válida</h2>
        <Button asChild>
          <Link href="/checkout">Volver al Checkout</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/checkout" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al Checkout
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Completar Pago</h1>
            <p className="text-gray-600">Método: {paymentMethod === "transfermovil" ? "Transfermóvil" : "Enzona"}</p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-2">
              <Clock className="h-4 w-4 mr-1" />
              {formatTime(timeLeft)}
            </Badge>
            <p className="text-sm text-gray-500">Tiempo restante</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Código QR y instrucciones */}
        <div className="space-y-6">
          <QRCodeDisplay paymentMethod={paymentMethod} total={total} />

          <Card>
            <CardHeader>
              <CardTitle>Instrucciones de Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Pasos a seguir:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>
                    Escanea el código QR con tu aplicación de{" "}
                    {paymentMethod === "transfermovil" ? "Transfermóvil" : "Enzona"}
                  </li>
                  <li>Verifica que el monto sea {formatPrice(total)}</li>
                  <li>Completa la transferencia</li>
                  <li>Copia el número de referencia de la transacción</li>
                  <li>Completa el formulario de confirmación</li>
                </ol>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> Guarda el comprobante de pago hasta que tu pedido sea confirmado.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulario de confirmación */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Confirmar Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="referenceNumber">Número de Referencia *</Label>
                <Input
                  id="referenceNumber"
                  value={paymentInfo.referenceNumber}
                  onChange={(e) => handleInputChange("referenceNumber", e.target.value)}
                  placeholder="Ej: 1234567890"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Número que aparece en tu comprobante de pago</p>
              </div>

              <div>
                <Label htmlFor="bankAccount">
                  {paymentMethod === "transfermovil" ? "Número de Teléfono" : "Últimos 4 dígitos de la tarjeta"} *
                </Label>
                <Input
                  id="bankAccount"
                  value={paymentInfo.bankAccount}
                  onChange={(e) => handleInputChange("bankAccount", e.target.value)}
                  placeholder={paymentMethod === "transfermovil" ? "53xxxxxxxx" : "****"}
                  required
                />
              </div>

              <div>
                <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                <Textarea
                  id="notes"
                  value={paymentInfo.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Cualquier información adicional sobre el pago"
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total a pagar:</span>
                  <span className="text-blue-600">{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
                onClick={handleSubmitPayment}
                disabled={!isFormValid() || isSubmitting}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                {isSubmitting ? "Procesando..." : "Confirmar Pago"}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Tu pedido será procesado una vez que verifiquemos el pago
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
