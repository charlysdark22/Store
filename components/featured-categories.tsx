"use client"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export function FeaturedCategories() {
  const { t } = useLanguage()

  const categories = [
    {
      name: t("computers"),
      slug: "computadoras-escritorio",
      image: "/placeholder.svg?height=300&width=400",
      description: t("desktopComputers"),
    },
    {
      name: t("laptops"),
      slug: "laptops",
      image: "/placeholder.svg?height=300&width=400",
      description: t("gamingLaptops"),
    },
    {
      name: t("phones"),
      slug: "telefonos",
      image: "/placeholder.svg?height=300&width=400",
      description: t("smartphones"),
    },
    {
      name: t("accessories"),
      slug: "accesorios-pc",
      image: "/placeholder.svg?height=300&width=400",
      description: t("pcAccessories"),
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("featuredCategories")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encuentra exactamente lo que necesitas en nuestra amplia selección de productos tecnológicos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.slug} href={`/categoria/${category.slug}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">{category.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
