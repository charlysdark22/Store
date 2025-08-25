"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

interface CartItem {
  id: string
  product_id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    images: string[]
    stock_quantity: number
    brand: string | null
    model: string | null
  }
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isLoading: boolean
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()
  const router = useRouter()

  // Calcular totales
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  // Obtener usuario actual
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        await refreshCart()
      } else {
        setItems([])
        setIsLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        refreshCart()
      } else {
        setItems([])
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const refreshCart = async () => {
    if (!user) {
      setItems([])
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          id,
          product_id,
          quantity,
          products (
            id,
            name,
            price,
            images,
            stock_quantity,
            brand,
            model
          )
        `)
        .eq("user_id", user.id)

      if (error) throw error

      const cartItems: CartItem[] =
        data?.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          product: item.products,
        })) || []

      setItems(cartItems)
    } catch (error) {
      console.error("Error fetching cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    try {
      // Verificar si el producto ya está en el carrito
      const existingItem = items.find((item) => item.product_id === productId)

      if (existingItem) {
        // Actualizar cantidad
        await updateQuantity(existingItem.id, existingItem.quantity + quantity)
      } else {
        // Agregar nuevo item
        const { error } = await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: productId,
          quantity,
        })

        if (error) throw error
        await refreshCart()
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const removeFromCart = async (itemId: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId).eq("user_id", user.id)

      if (error) throw error
      await refreshCart()
    } catch (error) {
      console.error("Error removing from cart:", error)
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user || quantity < 1) return

    try {
      const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId).eq("user_id", user.id)

      if (error) throw error
      await refreshCart()
    } catch (error) {
      console.error("Error updating quantity:", error)
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id)

      if (error) throw error
      setItems([])
    } catch (error) {
      console.error("Error clearing cart:", error)
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
