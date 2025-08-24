"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Product } from "@/lib/products"

export interface CartItem {
  id: string
  product: Product
  quantity: number
  price: number
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isLoading: boolean
}

interface CartContextType extends CartState {
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (productId: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
    isLoading: true,
  })

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem("cart-items")
    if (savedCart) {
      try {
        const items: CartItem[] = JSON.parse(savedCart)
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
        const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

        setState({
          items,
          totalItems,
          totalPrice,
          isLoading: false,
        })
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    } else {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem("cart-items", JSON.stringify(state.items))
    }
  }, [state.items, state.isLoading])

  const addItem = (product: Product, quantity = 1) => {
    setState((prev) => {
      const existingItem = prev.items.find((item) => item.id === product.id)

      let newItems: CartItem[]

      if (existingItem) {
        // Actualizar cantidad del item existente
        const newQuantity = Math.min(existingItem.quantity + quantity, product.quantity)
        newItems = prev.items.map((item) => (item.id === product.id ? { ...item, quantity: newQuantity } : item))
      } else {
        // Agregar nuevo item
        const newItem: CartItem = {
          id: product.id,
          product,
          quantity: Math.min(quantity, product.quantity),
          price: product.price,
        }
        newItems = [...prev.items, newItem]
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

      return {
        ...prev,
        items: newItems,
        totalItems,
        totalPrice,
      }
    })
  }

  const removeItem = (productId: string) => {
    setState((prev) => {
      const newItems = prev.items.filter((item) => item.id !== productId)
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

      return {
        ...prev,
        items: newItems,
        totalItems,
        totalPrice,
      }
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setState((prev) => {
      const newItems = prev.items.map((item) => {
        if (item.id === productId) {
          const maxQuantity = item.product.quantity
          return { ...item, quantity: Math.min(quantity, maxQuantity) }
        }
        return item
      })

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

      return {
        ...prev,
        items: newItems,
        totalItems,
        totalPrice,
      }
    })
  }

  const clearCart = () => {
    setState((prev) => ({
      ...prev,
      items: [],
      totalItems: 0,
      totalPrice: 0,
    }))
  }

  const getItemQuantity = (productId: string): number => {
    const item = state.items.find((item) => item.id === productId)
    return item ? item.quantity : 0
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemQuantity,
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
