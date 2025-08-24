"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authAPI, type AuthState } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar
    const checkAuth = async () => {
      try {
        const user = await authAPI.getCurrentUser()
        setState({
          user,
          isLoading: false,
          isAuthenticated: !!user,
        })
      } catch (error) {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const { user, token } = await authAPI.login(email, password)

      // Guardar en localStorage (en producción usar httpOnly cookies)
      localStorage.setItem("auth-token", token)
      localStorage.setItem("auth-user", JSON.stringify(user))

      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const register = async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const { user, token } = await authAPI.register(data)

      localStorage.setItem("auth-token", token)
      localStorage.setItem("auth-user", JSON.stringify(user))

      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = async () => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      await authAPI.logout()
      localStorage.removeItem("auth-token")
      localStorage.removeItem("auth-user")

      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  return <AuthContext.Provider value={{ ...state, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
