import { notFound } from "next/navigation"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { mockCategories, getProductsByCategory } from "@/lib/products"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = mockCategories.find((cat) => cat.slug === params.slug)

  if (!category) {
    notFound()
  }

  const products = getProductsByCategory(params.slug)

  return (
    <div className="min-h-screen bg-background">
      {/* Header de categoría */}
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{category.name}</h1>
            <p className="text-lg text-muted-foreground mb-6">{category.description}</p>
            <div className="text-sm text-muted-foreground">{products.length} productos encontrados</div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filtros - Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters products={products} />
          </div>

          {/* Grid de productos */}
          <div className="lg:col-span-3">
            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function generateStaticParams() {
  return mockCategories.map((category) => ({
    slug: category.slug,
  }))
}
