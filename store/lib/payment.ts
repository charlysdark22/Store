// Tipos para el sistema de pagos cubano
export interface PaymentMethod {
  id: string
  name: string
  type: "transfermovil" | "enzona"
  icon: string
  description: string
  banks?: Bank[]
}

export interface Bank {
  id: string
  name: string
  code: string
  color: string
}

export interface PaymentData {
  method: string
  bank?: string
  phoneNumber?: string
  cardNumber?: string
  pin?: string
  amount: number
  currency: string
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: string
  paymentMethod: string
  paymentStatus: "pending" | "processing" | "completed" | "failed"
  orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    province: string
    postalCode: string
  }
  createdAt: Date
  updatedAt: Date
}

// Bancos cubanos disponibles
export const cubanBanks: Bank[] = [
  {
    id: "bandec",
    name: "BANDEC",
    code: "BANDEC",
    color: "#1e40af", // blue-700
  },
  {
    id: "bpa",
    name: "Banco Popular de Ahorro",
    code: "BPA",
    color: "#dc2626", // red-600
  },
  {
    id: "metropolitano",
    name: "Banco Metropolitano",
    code: "METRO",
    color: "#059669", // emerald-600
  },
]

// Métodos de pago disponibles
export const paymentMethods: PaymentMethod[] = [
  {
    id: "transfermovil",
    name: "Transfermóvil",
    type: "transfermovil",
    icon: "📱",
    description: "Pago mediante transferencia móvil",
    banks: cubanBanks,
  },
  {
    id: "enzona",
    name: "Enzona",
    type: "enzona",
    icon: "💳",
    description: "Pago con tarjeta Enzona",
  },
]

// Simulación de API de pagos
export const paymentAPI = {
  async processPayment(
    paymentData: PaymentData,
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    // Simulación de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Validaciones básicas
    if (paymentData.method === "transfermovil") {
      if (!paymentData.phoneNumber || !paymentData.bank) {
        return { success: false, error: "Número de teléfono y banco son requeridos para Transfermóvil" }
      }

      if (paymentData.phoneNumber.length !== 8) {
        return { success: false, error: "El número de teléfono debe tener 8 dígitos" }
      }
    }

    if (paymentData.method === "enzona") {
      if (!paymentData.cardNumber || !paymentData.pin) {
        return { success: false, error: "Número de tarjeta y PIN son requeridos para Enzona" }
      }

      if (paymentData.cardNumber.length !== 16) {
        return { success: false, error: "El número de tarjeta debe tener 16 dígitos" }
      }
    }

    // Simulación de éxito/fallo (90% éxito)
    const success = Math.random() > 0.1

    if (success) {
      return {
        success: true,
        transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      }
    } else {
      return {
        success: false,
        error: "Error en el procesamiento del pago. Intente nuevamente.",
      }
    }
  },

  async createOrder(orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">): Promise<Order> {
    // Simulación de creación de orden
    await new Promise((resolve) => setTimeout(resolve, 500))

    const order: Order = {
      ...orderData,
      id: Date.now().toString(),
      orderNumber: `ORD-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Guardar en localStorage para simulación
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    orders.push(order)
    localStorage.setItem("orders", JSON.stringify(orders))

    return order
  },

  async getOrder(orderId: string): Promise<Order | null> {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    return orders.find((order: Order) => order.id === orderId) || null
  },
}
