import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/admin"
import { AdminLayout } from "@/components/admin/admin-layout"
import { OrdersManagement } from "@/components/admin/orders-management"

export default async function AdminOrdersPage() {
  const adminStatus = await isAdmin()

  if (!adminStatus) {
    redirect("/")
  }

  return (
    <AdminLayout>
      <OrdersManagement />
    </AdminLayout>
  )
}
