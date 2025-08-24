import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { ProtectedRoute } from "@/components/protected-route"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <div className="lg:pl-64">
          <AdminHeader />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
