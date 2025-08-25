import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/admin"
import { AdminLayout } from "@/components/admin/admin-layout"
import { ProductsManagement } from "@/components/admin/products-management"

export default async function AdminProductsPage() {
  const adminStatus = await isAdmin()

  if (!adminStatus) {
    redirect("/")
  }

  return (
    <AdminLayout>
      <ProductsManagement />
    </AdminLayout>
  )
}
