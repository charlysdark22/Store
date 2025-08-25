import { CheckoutPage } from "@/components/checkout/checkout-page"
import { Store } from "lucide-react"
import { UserNav } from "@/components/auth/user-nav"

export default function Checkout() {
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

      <CheckoutPage />
    </div>
  )
}
