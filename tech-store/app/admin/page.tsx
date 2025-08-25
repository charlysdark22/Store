import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/admin"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminLayout } from "@/components/admin/admin-layout"

export default async function AdminPage() {
  const adminStatus = await isAdmin()

  if (!adminStatus) {
    redirect("/")
  }

  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  )
}
