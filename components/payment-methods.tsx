"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Smartphone, CreditCard } from "lucide-react"
import { paymentMethods, cubanBanks, paymentAPI, type PaymentData } from "@/lib/payment"

interface PaymentMethodsProps {
  selectedMethod: string
  onMethodSelect: (method: string) => void
  amount: number
  shippingData: any
  onPaymentSuccess: (transactionId: string) => void
  onPaymentError: (error: string) => void
  onLoadingChange: (loading: boolean) => void
}

export function PaymentMethods({
  selectedMethod,
  onMethodSelect,
  amount,
  shippingData,
  onPaymentSuccess,
  onPaymentError,
  onLoadingChange,
}: PaymentMethodsProps) {
  const [paymentData, setPaymentData] = useState({
    phoneNumber: "",
    selectedBank: "",
    cardNumber: "",
    pin: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePaymentDataChange = (field: string, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = (): string | null => {
    if (!selectedMethod) return "Selecciona un método de pago"

    // Validar datos de envío
    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "province"]
    for (const field of requiredFields) {
      if (!shippingData[field]) {
        return `El campo ${field} es requerido`
      }
    }

    if (selectedMethod === "transfermovil") {
      if (!paymentData.phoneNumber) return "Número de teléfono es requerido"
      if (!paymentData.selectedBank) return "Selecciona un banco"
      if (paymentData.phoneNumber.length !== 8) return "El número debe tener 8 dígitos"
    }

    if (selectedMethod === "enzona") {
      if (!paymentData.cardNumber) return "Número de tarjeta es requerido"
      if (!paymentData.pin) return "PIN es requerido"
      if (paymentData.cardNumber.length !== 16) return "El número de tarjeta debe tener 16 dígitos"
      if (paymentData.pin.length !== 4) return "El PIN debe tener 4 dígitos"
    }

    return null
  }

  const handleProcessPayment = async () => {
    const validationError = validateForm()
    if (validationError) {
      onPaymentError(validationError)
      return
    }

    setIsProcessing(true)
    onLoadingChange(true)

    try {
      const paymentRequest: PaymentData = {
        method: selectedMethod,
        amount,
        currency: "CUP",
      }

      if (selectedMethod === "transfermovil") {
        paymentRequest.phoneNumber = paymentData.phoneNumber
        paymentRequest.bank = paymentData.selectedBank
      } else if (selectedMethod === "enzona") {
        paymentRequest.cardNumber = paymentData.cardNumber
        paymentRequest.pin = paymentData.pin
      }

      const result = await paymentAPI.processPayment(paymentRequest)

      if (result.success && result.transactionId) {
        // Crear orden
        await paymentAPI.createOrder({
          userId: undefined, // Se puede agregar si hay usuario autenticado
          items: [], // Se pasarían los items del carrito
          subtotal: amount * 0.9, // Aproximado
          tax: amount * 0.1,
          shipping: 0,
          total: amount,
          currency: "CUP",
          paymentMethod: selectedMethod,
          paymentStatus: "completed",
          orderStatus: "confirmed",
          shippingAddress: shippingData,
        })

        onPaymentSuccess(result.transactionId)
      } else {
        onPaymentError(result.error || "Error en el procesamiento del pago")
      }
    } catch (error) {
      onPaymentError("Error de conexión. Intente nuevamente.")
    } finally {
      setIsProcessing(false)
      onLoadingChange(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Selección de método de pago */}
      <div className="grid gap-4">
        {paymentMethods.map((method) => (
          <Card
            key={method.id}
            className={`cursor-pointer transition-all ${
              selectedMethod === method.id ? "ring-2 ring-primary" : "hover:shadow-md"
            }`}
            onClick={() => onMethodSelect(method.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {method.type === "transfermovil" ? (
                    <Smartphone className="h-6 w-6" />
                  ) : (
                    <CreditCard className="h-6 w-6" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{method.name}</h3>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedMethod === method.id ? "bg-primary border-primary" : "border-muted-foreground"
                  }`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Formulario específico del método seleccionado */}
      {selectedMethod === "transfermovil" && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <h4 className="font-semibold">Datos de Transfermóvil</h4>

            <div>
              <Label htmlFor="bank">Banco *</Label>
              <Select
                value={paymentData.selectedBank}
                onValueChange={(value) => handlePaymentDataChange("selectedBank", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar banco" />
                </SelectTrigger>
                <SelectContent>
                  {cubanBanks.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id}>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: bank.color }} />
                        <span>{bank.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="phoneNumber">Número de Teléfono *</Label>
              <Input
                id="phoneNumber"
                value={paymentData.phoneNumber}
                onChange={(e) => handlePaymentDataChange("phoneNumber", e.target.value.replace(/\D/g, "").slice(0, 8))}
                placeholder="5XXXXXXX"
                maxLength={8}
              />
              <p className="text-xs text-muted-foreground mt-1">Número asociado a tu cuenta bancaria</p>
            </div>

            <Alert>
              <AlertDescription>
                Se enviará una notificación a tu teléfono para confirmar la transferencia de ${amount.toLocaleString()}{" "}
                CUP.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {selectedMethod === "enzona" && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <h4 className="font-semibold">Datos de Enzona</h4>

            <div>
              <Label htmlFor="cardNumber">Número de Tarjeta *</Label>
              <Input
                id="cardNumber"
                value={paymentData.cardNumber}
                onChange={(e) => handlePaymentDataChange("cardNumber", e.target.value.replace(/\D/g, "").slice(0, 16))}
                placeholder="1234 5678 9012 3456"
                maxLength={16}
              />
            </div>

            <div>
              <Label htmlFor="pin">PIN *</Label>
              <Input
                id="pin"
                type="password"
                value={paymentData.pin}
                onChange={(e) => handlePaymentDataChange("pin", e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="****"
                maxLength={4}
              />
            </div>

            <Alert>
              <AlertDescription>Tu información está protegida con encriptación de extremo a extremo.</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Botón de pago */}
      {selectedMethod && (
        <Button size="lg" className="w-full" onClick={handleProcessPayment} disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Procesando Pago...
            </>
          ) : (
            `Pagar ${amount.toLocaleString()} CUP`
          )}
        </Button>
      )}
    </div>
  )
}
