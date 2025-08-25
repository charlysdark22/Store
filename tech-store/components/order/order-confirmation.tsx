import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Package, Clock, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface OrderConfirmationProps {
  order: {
    id: string
    total_amount: number
    status: string
    payment_method: string
    payment_status: string
    created_at: string
    shipping_address: any
    order_items: Array<{
      quantity: number
      unit_price: number
      total_price: number
      products: {
        name: string
        price: number
        images: string[]
      }
    }>
  }
}

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CU", {
      style: "currency",
      currency: "CUP",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-purple-100 text-purple-800"
      case "shipped":
        return "bg-indigo-100 text-indigo-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "confirmed":
        return "Confirmado"
      case "processing":
        return "Procesando"
      case "shipped":
        return "Enviado"
      case "delivered":
        return "Entregado"
      default:
        return status
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Confirmación exitosa */}
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pedido Confirmado!</h1>
        <p className="text-gray-600">Tu pedido #{order.id.slice(0, 8)} ha sido recibido y está siendo procesado</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Detalles del pedido */}
        <div className="lg:col-span-2 space-y-6">
          {/* Estado del pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Estado del Pedido</span>
                <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Pedido recibido</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">En proceso de verificación</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Recibirás una notificación cuando tu pago sea verificado y tu pedido sea confirmado.
              </p>
            </CardContent>
          </Card>

          {/* Productos */}
          <Card>
            <CardHeader>
              <CardTitle>Productos Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <Image
                      src={item.products.images?.[0] || "/placeholder.svg"}
                      alt={item.products.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.products.name}</h4>
                      <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                      <p className="text-sm font-medium">{formatPrice(item.total_price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Información de envío */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Envío</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Nombre:</strong> {order.shipping_address.fullName}
                </p>
                <p>
                  <strong>Teléfono:</strong> {order.shipping_address.phone}
                </p>
                <p>
                  <strong>Dirección:</strong> {order.shipping_address.address}
                </p>
                <p>
                  <strong>Ciudad:</strong> {order.shipping_address.city}, {order.shipping_address.province}
                </p>
                {order.shipping_address.notes && (
                  <p>
                    <strong>Notas:</strong> {order.shipping_address.notes}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.total_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">{formatPrice(order.total_amount)}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <strong>Método de pago:</strong>{" "}
                  {order.payment_method === "transfermovil" ? "Transfermóvil" : "Enzona"}
                </p>
                <p>
                  <strong>Estado del pago:</strong>
                  <Badge className="ml-2" variant={order.payment_status === "completed" ? "default" : "secondary"}>
                    {order.payment_status === "pending" ? "Pendiente" : "Completado"}
                  </Badge>
                </p>
                <p>
                  <strong>Fecha:</strong> {formatDate(order.created_at)}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/products">Continuar Comprando</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Volver al Inicio
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
