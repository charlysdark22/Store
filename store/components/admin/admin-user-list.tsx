"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MoreHorizontal, Eye, Shield, ShieldOff } from "lucide-react"

// Datos simulados de usuarios
const mockUsers = [
  {
    id: "1",
    firstName: "Admin",
    lastName: "TechStore",
    email: "admin@techstore.cu",
    isAdmin: true,
    createdAt: "2024-01-01",
    lastLogin: "2024-01-15",
    orders: 0,
  },
  {
    id: "2",
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan@email.com",
    isAdmin: false,
    createdAt: "2024-01-10",
    lastLogin: "2024-01-15",
    orders: 3,
  },
  {
    id: "3",
    firstName: "María",
    lastName: "García",
    email: "maria@email.com",
    isAdmin: false,
    createdAt: "2024-01-12",
    lastLogin: "2024-01-14",
    orders: 1,
  },
  {
    id: "4",
    firstName: "Carlos",
    lastName: "López",
    email: "carlos@email.com",
    isAdmin: false,
    createdAt: "2024-01-13",
    lastLogin: "2024-01-13",
    orders: 2,
  },
]

export function AdminUserList() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Usuarios</h1>
        <p className="text-muted-foreground">Gestiona los usuarios registrados</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Pedidos</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead>Último Acceso</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.isAdmin ? "default" : "secondary"}>
                      {user.isAdmin ? "Administrador" : "Cliente"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.orders} pedidos</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Perfil
                        </DropdownMenuItem>
                        {!user.isAdmin ? (
                          <DropdownMenuItem>
                            <Shield className="h-4 w-4 mr-2" />
                            Hacer Admin
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>
                            <ShieldOff className="h-4 w-4 mr-2" />
                            Quitar Admin
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
