// Simulación de autenticación (se conectará a la base de datos más adelante)
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  isAdmin: boolean
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Simulación de API de autenticación
export const authAPI = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Simulación - reemplazar con llamada real a la API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === "admin@techstore.cu" && password === "admin123") {
      return {
        user: {
          id: "1",
          email: "admin@techstore.cu",
          firstName: "Admin",
          lastName: "TechStore",
          isAdmin: true,
        },
        token: "mock-jwt-token",
      }
    }

    if (email === "user@example.com" && password === "user123") {
      return {
        user: {
          id: "2",
          email: "user@example.com",
          firstName: "Usuario",
          lastName: "Demo",
          isAdmin: false,
        },
        token: "mock-jwt-token",
      }
    }

    throw new Error("Credenciales inválidas")
  },

  async register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<{ user: User; token: string }> {
    // Simulación - reemplazar con llamada real a la API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      user: {
        id: Date.now().toString(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        isAdmin: false,
      },
      token: "mock-jwt-token",
    }
  },

  async logout(): Promise<void> {
    // Simulación
    await new Promise((resolve) => setTimeout(resolve, 500))
  },

  async getCurrentUser(): Promise<User | null> {
    // Simulación - verificar token almacenado
    const token = localStorage.getItem("auth-token")
    if (!token) return null

    // En producción, verificar el token con el servidor
    const userData = localStorage.getItem("auth-user")
    return userData ? JSON.parse(userData) : null
  },
}
