"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{t("heroTitle")}</h1>
              <p className="text-xl text-muted-foreground max-w-lg">{t("heroSubtitle")}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/productos">{t("shopNow")}</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/ofertas">Ver Ofertas</Link>
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-muted-foreground">{t("products")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">Soporte</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-muted-foreground">Seguro</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 p-8">
              <img
                src="/placeholder.svg?height=600&width=600"
                alt="Dispositivos tecnológicos"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
