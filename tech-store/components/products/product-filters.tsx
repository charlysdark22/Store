"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Search, X } from "lucide-react"

interface Category {
  id: string
  name: string
  name_en: string
}

interface ProductFiltersProps {
  categories: Category[]
  searchParams: {
    category?: string
    search?: string
    minPrice?: string
    maxPrice?: string
    brand?: string
  }
}

export function ProductFilters({ categories, searchParams }: ProductFiltersProps) {
  const router = useRouter()
  const urlSearchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.search || "")
  const [minPrice, setMinPrice] = useState(searchParams.minPrice || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || "")
  const [brand, setBrand] = useState(searchParams.brand || "")

  const updateFilters = () => {
    const params = new URLSearchParams()

    if (search) params.set("search", search)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    if (selectedCategory) params.set("category", selectedCategory)
    if (brand) params.set("brand", brand)

    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch("")
    setMinPrice("")
    setMaxPrice("")
    setSelectedCategory("")
    setBrand("")
    router.push("/products")
  }

  const hasActiveFilters = search || minPrice || maxPrice || selectedCategory || brand

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Filtros
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Búsqueda */}
          <div className="space-y-2">
            <Label htmlFor="search">Buscar productos</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="search"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                onKeyDown={(e) => e.key === "Enter" && updateFilters()}
              />
            </div>
          </div>

          {/* Categorías */}
          <div className="space-y-3">
            <Label>Categorías</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all-categories"
                  checked={!selectedCategory}
                  onCheckedChange={() => setSelectedCategory("")}
                />
                <Label htmlFor="all-categories" className="text-sm font-normal">
                  Todas las categorías
                </Label>
              </div>
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategory === category.id}
                    onCheckedChange={() => setSelectedCategory(selectedCategory === category.id ? "" : category.id)}
                  />
                  <Label htmlFor={category.id} className="text-sm font-normal">
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Rango de precios */}
          <div className="space-y-3">
            <Label>Rango de precios (CUP)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input type="number" placeholder="Mín" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              </div>
              <div>
                <Input type="number" placeholder="Máx" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Marca */}
          <div className="space-y-2">
            <Label htmlFor="brand">Marca</Label>
            <Input
              id="brand"
              placeholder="Filtrar por marca..."
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <Button onClick={updateFilters} className="w-full bg-blue-600 hover:bg-blue-700">
            Aplicar Filtros
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
