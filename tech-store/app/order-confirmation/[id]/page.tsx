import { createClient } from "@/lib/supabase/server"
import { OrderConfirmation } from "@/components/order/order-confirmation"
import { Store } from "lucide-react"
import { UserNav } from "@/components/auth/user-nav"
import { notFound } from "next/navigation"

export default async function OrderConfirmationPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (
          name,
          price,
          images
        )
      )
    `)
    .eq("id", params.id)
    .single()

  if (error || !order) {
    notFound()
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

      <OrderConfirmation order={order} />
    </div>
  )
}
