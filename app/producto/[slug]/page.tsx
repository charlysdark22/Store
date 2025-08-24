import { notFound } from "next/navigation"
import { ProductDetail } from "@/components/product-detail"
import { RelatedProducts } from "@/components/related-products"
import { getProductBySlug, getProductsByCategory } from "@/lib/products"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = getProductsByCategory(product.categorySlug)
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ProductDetail product={product} />

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  )
}

export function generateStaticParams() {
  return [
    { slug: "gaming-pc-rtx-4070-super" },
    { slug: "pc-oficina-intel-i5" },
    { slug: "macbook-air-m2-13" },
    { slug: "gaming-laptop-rtx-4060" },
    { slug: "iphone-15-pro-128gb" },
    { slug: "samsung-galaxy-s24-ultra" },
    { slug: "teclado-mecanico-rgb" },
    { slug: "mouse-gaming-inalambrico" },
  ]
}
