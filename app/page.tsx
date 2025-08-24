import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { FeaturedCategories } from "@/components/featured-categories"
import { FeaturedProducts } from "@/components/featured-products"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturedCategories />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  )
}
