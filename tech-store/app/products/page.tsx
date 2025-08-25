import { createClient } from "@/lib/supabase/server"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductFilters } from "@/components/products/product-filters"
import { Store } from "lucide-react"
import { UserNav } from "@/components/auth/user-nav"

interface SearchParams {
  category?: string
  search?: string
  minPrice?: string
  maxPrice?: string
  brand?: string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = await createClient()

  // Construir query base
  let query = supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        name_en
      )
    `)
    .eq("is_active", true)

  // Aplicar filtros
  if (searchParams.category) {
    query = query.eq("category_id", searchParams.category)
  }

  if (searchParams.search) {
    query = query.or(`name.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`)
  }

  if (searchParams.minPrice) {
    query = query.gte("price", Number.parseFloat(searchParams.minPrice))
  }

  if (searchParams.maxPrice) {
    query = query.lte("price", Number.parseFloat(searchParams.maxPrice))
  }

  if (searchParams.brand) {
    query = query.ilike("brand", `%${searchParams.brand}%`)
  }

  const { data: products, error } = await query.order("created_at", { ascending: false })

  // Obtener categorías para filtros
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching products:", error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Store className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">TechStore Cuba</h1>
            </div>
            <UserNav />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Productos</h1>
          <p className="text-gray-600">
            Encuentra la mejor tecnología con {products?.length || 0} productos disponibles
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros */}
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters categories={categories || []} searchParams={searchParams} />
          </aside>

          {/* Grid de productos */}
          <main className="flex-1">
            <ProductGrid products={products || []} />
          </main>
        </div>
      </div>
    </div>
  )
}
