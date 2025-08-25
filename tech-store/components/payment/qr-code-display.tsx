import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface QRCodeDisplayProps {
  paymentMethod: "transfermovil" | "enzona"
  total: number
}

export function QRCodeDisplay({ paymentMethod, total }: QRCodeDisplayProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CU", {
      style: "currency",
      currency: "CUP",
    }).format(price)
  }

  const qrImage = paymentMethod === "transfermovil" ? "/images/transfermovil-qr.png" : "/images/enzona-qr.png"

  const bankInfo =
    paymentMethod === "transfermovil" ? "Compatible con BANDEC, BPA y Metropolitano" : "Tarjeta magnética cubana"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Código QR - {paymentMethod === "transfermovil" ? "Transfermóvil" : "Enzona"}</span>
          <Badge className="bg-blue-100 text-blue-800">{formatPrice(total)}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
            <Image
              src={qrImage || "/placeholder.svg"}
              alt={`Código QR ${paymentMethod}`}
              width={250}
              height={250}
              className="mx-auto"
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-lg">Monto a pagar: {formatPrice(total)}</p>
          <p className="text-sm text-gray-600">{bankInfo}</p>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            Escanea este código QR con tu aplicación de {paymentMethod === "transfermovil" ? "Transfermóvil" : "Enzona"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
