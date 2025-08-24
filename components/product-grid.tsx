"use client"

import { useState } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product } from "@/lib/products"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const [sortBy, setSortBy] = useState("featured")
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12

  // Ordenar productos
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name":
        return a.name.localeCompare(b.name)
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.isNew ? 1 : -1
      default: // featured
        return b.isFeatured ? 1 : -1
    }
  })

  // Paginación
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage)

  return (
    <div className="space-y-6">
      {/* Header con ordenamiento */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {startIndex + 1}-{Math.min(startIndex + productsPerPage, sortedProducts.length)} de{" "}
          {sortedProducts.length} productos
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Destacados</SelectItem>
            <SelectItem value="newest">Más nuevos</SelectItem>
            <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
            <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
            <SelectItem value="name">Nombre A-Z</SelectItem>
            <SelectItem value="rating">Mejor valorados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid de productos */}
      {paginatedProducts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No se encontraron productos</p>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>

          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}
