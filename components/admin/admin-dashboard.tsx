"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown, Eye, Plus } from "lucide-react"
import Link from "next/link"

// Datos simulados para el dashboard
const stats = [
  {
    title: "Ventas Totales",
    value: "$125,430",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Pedidos",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Productos",
    value: "456",
    change: "+2.1%",
    trend: "up",
    icon: Package,
  },
  {
    title: "Usuarios",
    value: "2,345",
    change: "+15.3%",
    trend: "up",
    icon: Users,
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Juan Pérez",
    amount: "$2,500",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "María García",
    amount: "$1,800",
    status: "processing",
    date: "2024-01-15",
  },
  {
    id: "ORD-003",
    customer: "Carlos López",
    amount: "$3,200",
    status: "pending",
    date: "2024-01-14",
  },
  {
    id: "ORD-004",
    customer: "Ana Rodríguez",
    amount: "$950",
    status: "completed",
    date: "2024-01-14",
  },
]

const topProducts = [
  {
    name: "Gaming PC RTX 4070",
    sales: 45,
    revenue: "$202,500",
  },
  {
    name: "MacBook Air M2",
    sales: 32,
    revenue: "$208,000",
  },
  {
    name: "iPhone 15 Pro",
    sales: 28,
    revenue: "$238,000",
  },
  {
    name: "Samsung Galaxy S24",
    sales: 22,
    revenue: "$165,000",
  },
]

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Resumen de tu tienda online</p>
        </div>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href="/admin/productos/nuevo">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                <span className="ml-1">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pedidos Recientes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/pedidos">
                <Eye className="h-4 w-4 mr-2" />
                Ver Todos
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.id} • {order.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "default"
                          : order.status === "processing"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-xs"
                    >
                      {order.status === "completed"
                        ? "Completado"
                        : order.status === "processing"
                          ? "Procesando"
                          : "Pendiente"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Productos Más Vendidos</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/productos">
                <Eye className="h-4 w-4 mr-2" />
                Ver Todos
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} ventas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
              <Link href="/admin/productos/nuevo">
                <Package className="h-6 w-6 mb-2" />
                Agregar Producto
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
              <Link href="/admin/pedidos">
                <ShoppingCart className="h-6 w-6 mb-2" />
                Gestionar Pedidos
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
              <Link href="/admin/usuarios">
                <Users className="h-6 w-6 mb-2" />
                Ver Usuarios
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
