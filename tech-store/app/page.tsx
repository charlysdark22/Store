"use client"

import { Store, Laptop, Smartphone, Monitor, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UserNav } from "@/components/auth/user-nav"
import { useLanguage } from "@/contexts/language-context"

export default function HomePage() {
  const { t } = useLanguage()

  const categories = [
    { name: "Computadoras", icon: Monitor, count: "15+ productos" },
    { name: "Laptops", icon: Laptop, count: "25+ productos" },
    { name: "Teléfonos", icon: Smartphone, count: "30+ productos" },
    { name: "Accesorios", icon: Headphones, count: "50+ productos" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Store className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("home.title")}</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
                {t("nav.home")}
              </a>
              <a href="/products" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
                {t("nav.products")}
              </a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
                Ofertas
              </a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
                Contacto
              </a>
            </nav>
            <UserNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t("home.subtitle")}
            <span className="text-blue-600"> Tecnología</span>
            <br />
            de Confianza
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">{t("home.description")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8">
              <a href="/products">{t("home.shop_now")}</a>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent">
              Conocer Más
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Nuestras Categorías</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <CardContent className="p-6 text-center">
                  <category.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{category.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t("payment.title")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t("payment.transfermovil")}</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Paga de forma segura con tu cuenta Transfermóvil</p>
              <div className="text-sm text-gray-500 dark:text-gray-400">Compatible con BANDEC, BPA y Metropolitano</div>
            </Card>
            <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t("payment.enzona")}</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Utiliza tu tarjeta magnética cubana de forma segura
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">Procesamiento instantáneo y seguro</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Store className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold">{t("home.title")}</h1>
          </div>
          <p className="text-gray-400 mb-8">Tu tienda de tecnología de confianza en Cuba</p>
          <div className="text-sm text-gray-500">© 2024 TechStore Cuba. Todos los derechos reservados.</div>
        </div>
      </footer>
    </div>
  )
}
