"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, Store, CreditCard, Truck, Bell } from "lucide-react"

export function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: "TechStore Cuba",
    storeDescription: "Tu tienda de tecnología en Cuba",
    storeEmail: "info@techstore.cu",
    storePhone: "+53 5555-5555",
    storeAddress: "La Habana, Cuba",
    currency: "CUP",
    taxRate: "10",
    freeShippingThreshold: "50000",
    enableTransfermovil: true,
    enableEnzona: true,
    enableNotifications: true,
    enableInventoryAlerts: true,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Aquí se guardarían las configuraciones
    console.log("Guardando configuraciones:", settings)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">Configura los ajustes de tu tienda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información de la Tienda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="h-5 w-5 mr-2" />
              Información de la Tienda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="storeName">Nombre de la Tienda</Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) => handleInputChange("storeName", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="storeDescription">Descripción</Label>
              <Textarea
                id="storeDescription"
                value={settings.storeDescription}
                onChange={(e) => handleInputChange("storeDescription", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="storeEmail">Email de Contacto</Label>
              <Input
                id="storeEmail"
                type="email"
                value={settings.storeEmail}
                onChange={(e) => handleInputChange("storeEmail", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="storePhone">Teléfono</Label>
              <Input
                id="storePhone"
                value={settings.storePhone}
                onChange={(e) => handleInputChange("storePhone", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="storeAddress">Dirección</Label>
              <Textarea
                id="storeAddress"
                value={settings.storeAddress}
                onChange={(e) => handleInputChange("storeAddress", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Pagos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Métodos de Pago
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currency">Moneda</Label>
              <Input
                id="currency"
                value={settings.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
                disabled
              />
            </div>

            <div>
              <Label htmlFor="taxRate">Tasa de Impuestos (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={settings.taxRate}
                onChange={(e) => handleInputChange("taxRate", e.target.value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Transfermóvil</Label>
                <p className="text-sm text-muted-foreground">Habilitar pagos por Transfermóvil</p>
              </div>
              <Switch
                checked={settings.enableTransfermovil}
                onCheckedChange={(checked) => handleInputChange("enableTransfermovil", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Enzona</Label>
                <p className="text-sm text-muted-foreground">Habilitar pagos con tarjeta Enzona</p>
              </div>
              <Switch
                checked={settings.enableEnzona}
                onCheckedChange={(checked) => handleInputChange("enableEnzona", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Envíos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Envíos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="freeShippingThreshold">Envío Gratis a partir de (CUP)</Label>
              <Input
                id="freeShippingThreshold"
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => handleInputChange("freeShippingThreshold", e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Pedidos superiores a este monto tendrán envío gratuito
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificaciones por Email</Label>
                <p className="text-sm text-muted-foreground">Recibir notificaciones de nuevos pedidos</p>
              </div>
              <Switch
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => handleInputChange("enableNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Alertas de Inventario</Label>
                <p className="text-sm text-muted-foreground">Notificar cuando el stock esté bajo</p>
              </div>
              <Switch
                checked={settings.enableInventoryAlerts}
                onCheckedChange={(checked) => handleInputChange("enableInventoryAlerts", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  )
}
