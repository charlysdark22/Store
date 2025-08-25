import { ProductCard } from "./product-card"

interface Product {
  id: string
  name: string
  name_en: string
  description: string | null
  price: number
  brand: string | null
  model: string | null
  images: string[]
  stock_quantity: number
  categories: {
    id: string
    name: string
    name_en: string
  } | null
}

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No se encontraron productos</div>
        <div className="text-gray-400">Intenta ajustar los filtros de búsqueda</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
