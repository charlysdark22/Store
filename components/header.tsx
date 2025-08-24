"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, ShoppingCart, User, Menu, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useLanguage } from "@/contexts/language-context"
import { ThemeLanguageControls } from "@/components/theme-language-controls"

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart()
  const { t } = useLanguage()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">TC</span>
            </div>
            <span className="font-bold text-xl">TechStore</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder={t("search")} className="pl-10 pr-4" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <ThemeLanguageControls />

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user.firstName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/perfil">{t("profile")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/pedidos">{t("orders")}</Link>
                  </DropdownMenuItem>
                  {user.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">{t("admin")}</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">
                  <User className="h-4 w-4 mr-2" />
                  {t("login")}
                </Link>
              </Button>
            )}

            <Button variant="ghost" size="sm" className="relative" asChild>
              <Link href="/carrito">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Link>
            </Button>
          </nav>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder={t("search")} className="pl-10" />
                </div>

                {isAuthenticated && user ? (
                  <>
                    <div className="border-b pb-4">
                      <p className="font-medium">Hola, {user.firstName}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>

                    <Button variant="ghost" className="justify-start" asChild>
                      <Link href="/perfil">
                        <User className="h-4 w-4 mr-2" />
                        {t("profile")}
                      </Link>
                    </Button>

                    <Button variant="ghost" className="justify-start" asChild>
                      <Link href="/pedidos">{t("orders")}</Link>
                    </Button>

                    {user.isAdmin && (
                      <Button variant="ghost" className="justify-start" asChild>
                        <Link href="/admin">{t("admin")}</Link>
                      </Button>
                    )}

                    <Button variant="ghost" className="justify-start" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      {t("logout")}
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/login">
                      <User className="h-4 w-4 mr-2" />
                      {t("login")}
                    </Link>
                  </Button>
                )}

                <Button variant="ghost" className="justify-start relative" asChild>
                  <Link href="/carrito">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {t("cart")}
                    {totalItems > 0 && <Badge className="ml-auto">{totalItems}</Badge>}
                  </Link>
                </Button>

                <div className="flex items-center justify-between pt-4 border-t">
                  <ThemeLanguageControls />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Categories Navigation */}
        <div className="hidden md:flex items-center space-x-6 py-3 border-t">
          <Link
            href="/categoria/computadoras-escritorio"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {t("computers")}
          </Link>
          <Link href="/categoria/laptops" className="text-sm font-medium hover:text-primary transition-colors">
            {t("laptops")}
          </Link>
          <Link href="/categoria/telefonos" className="text-sm font-medium hover:text-primary transition-colors">
            {t("phones")}
          </Link>
          <Link href="/categoria/accesorios-pc" className="text-sm font-medium hover:text-primary transition-colors">
            {t("accessories")} PC
          </Link>
          <Link
            href="/categoria/accesorios-laptop"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {t("accessories")} {t("laptops")}
          </Link>
          <Link
            href="/categoria/accesorios-telefono"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {t("accessories")} {t("phones")}
          </Link>
        </div>
      </div>
    </header>
  )
}
