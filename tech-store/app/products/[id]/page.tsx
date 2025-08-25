import { createClient } from "@/lib/supabase/server"
import { ProductDetail } from "@/components/products/product-detail"
import { Store, ArrowLeft } from "lucide-react"
import { UserNav } from "@/components/auth/user-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        name_en
      )
    `)
    .eq("id", params.id)
    .eq("is_active", true)
    .single()

  if (error || !product) {
    notFound()
  }

  // Obtener productos relacionados de la misma categoría
  const { data: relatedProducts } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        name_en
      )
    `)
    .eq("category_id", product.category_id)
    .eq("is_active", true)
    .neq("id", product.id)
    .limit(4)

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
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/products" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a Productos
            </Link>
          </Button>
        </div>

        <ProductDetail product={product} relatedProducts={relatedProducts || []} />
      </div>
    </div>
  )
}
