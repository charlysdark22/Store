"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface PaymentMethodsProps {
  selectedMethod: "transfermovil" | "enzona" | null
  onMethodSelect: (method: "transfermovil" | "enzona") => void
}

export function PaymentMethods({ selectedMethod, onMethodSelect }: PaymentMethodsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Método de Pago</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedMethod || ""}
          onValueChange={(value) => onMethodSelect(value as "transfermovil" | "enzona")}
          className="space-y-4"
        >
          {/* Transfermóvil */}
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="transfermovil" id="transfermovil" />
            <Label htmlFor="transfermovil" className="flex-1 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Transfermóvil</h3>
                  <p className="text-sm text-gray-600">Pago seguro con tu cuenta móvil</p>
                  <p className="text-xs text-gray-500 mt-1">Compatible con BANDEC, BPA y Metropolitano</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xs">TM</span>
                </div>
              </div>
            </Label>
          </div>

          {/* Enzona */}
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="enzona" id="enzona" />
            <Label htmlFor="enzona" className="flex-1 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Enzona</h3>
                  <p className="text-sm text-gray-600">Pago con tarjeta magnética cubana</p>
                  <p className="text-xs text-gray-500 mt-1">Procesamiento instantáneo y seguro</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xs">EZ</span>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {selectedMethod && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Método seleccionado:</strong> {selectedMethod === "transfermovil" ? "Transfermóvil" : "Enzona"}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Serás redirigido a la página de pago para completar la transacción
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
