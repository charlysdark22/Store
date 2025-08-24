"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Truck, CreditCard, ArrowRight, Download } from "lucide-react"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const transactionId = searchParams.get("transaction")
  const [orderNumber] = useState(`ORD-${Date.now()}`)

  useEffect(() => {
    // Aquí se podría hacer una llamada para obtener los detalles de la orden
    console.log("Transaction ID:", transactionId)
  }, [transactionId])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header de confirmación */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">¡Pedido Confirmado!</h1>
            <p className="text-lg text-muted-foreground">Tu pedido ha sido procesado exitosamente</p>
          </div>

          {/* Información del pedido */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Detalles del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Número de Pedido</p>
                  <p className="font-semibold">{orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID de Transacción</p>
                  <p className="font-semibold">{transactionId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado del Pago</p>
                  <Badge className="bg-green-100 text-green-800">Completado</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado del Pedido</p>
                  <Badge variant="outline">Confirmado</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Próximos pasos */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>¿Qué sigue?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Pago Procesado</h4>
                    <p className="text-sm text-muted-foreground">
                      Tu pago ha sido confirmado y procesado exitosamente.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Preparando Pedido</h4>
                    <p className="text-sm text-muted-foreground">
                      Nuestro equipo está preparando tu pedido para el envío.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Envío</h4>
                    <p className="text-sm text-muted-foreground">
                      Te notificaremos cuando tu pedido sea enviado con el número de seguimiento.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de contacto */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Recibirás un correo de confirmación con todos los detalles.
                </p>
                <p className="text-sm text-muted-foreground">
                  Si tienes preguntas, contáctanos al <strong>+53 5555-5555</strong> o{" "}
                  <strong>soporte@techstore.cu</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="flex-1" asChild>
              <Link href="/pedidos">
                Ver Mis Pedidos
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="flex-1 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Descargar Factura
            </Button>
          </div>

          <div className="text-center mt-8">
            <Button variant="ghost" asChild>
              <Link href="/">Continuar Comprando</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
