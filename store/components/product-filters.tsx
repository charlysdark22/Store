"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Product } from "@/lib/products"

interface ProductFiltersProps {
  products: Product[]
}

export function ProductFilters({ products }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)

  // Obtener marcas únicas
  const brands = Array.from(new Set(products.map((p) => p.brand))).sort()

  // Obtener rango de precios
  const minPrice = Math.min(...products.map((p) => p.price))
  const maxPrice = Math.max(...products.map((p) => p.price))

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand])
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    }
  }

  const clearFilters = () => {
    setPriceRange([minPrice, maxPrice])
    setSelectedBrands([])
    setInStockOnly(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtros</CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Limpiar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Filtro de precio */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Rango de Precio</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={maxPrice}
              min={minPrice}
              step={1000}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        <Separator />

        {/* Filtro de marcas */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Marcas</Label>
          <div className="space-y-3">
            {brands.map((brand) => {
              const productCount = products.filter((p) => p.brand === brand).length
              return (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                  />
                  <Label htmlFor={`brand-${brand}`} className="text-sm flex-1 cursor-pointer">
                    {brand} ({productCount})
                  </Label>
                </div>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* Filtro de disponibilidad */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Disponibilidad</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={inStockOnly}
              onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
            />
            <Label htmlFor="in-stock" className="text-sm cursor-pointer">
              Solo productos en stock
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
