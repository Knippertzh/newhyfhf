"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
// These imports are only used for types
import type { Role } from '@prisma/client'

type User = {
  id: string
  name: string
  email: string
  role: "USER" | "ADMIN"
} | null

type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<void>
  adminLogin: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Mock auth check - replace with actual auth check
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Protect routes
  useEffect(() => {
    if (!isLoading) {
      const publicRoutes = ["/login", "/pre-register", "/forgot-password"]
      const adminRoutes = ["/admin", "/admin/dashboard", "/admin/users"]

      // Only redirect if not on a public route and not authenticated
      if (!user && !publicRoutes.some((route) => pathname?.startsWith(route))) {
        router.push("/login")
      }

      // Only redirect if on admin route but not an admin
      if (user?.role !== "ADMIN" && adminRoutes.some((route) => pathname?.startsWith(route))) {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock login - replace with actual login API call
      if (email === "user@example.com" && password === "password") {
        const userData = {
          id: "1",
          name: "Test User",
          email: "user@example.com",
          role: "USER" as const,
        }

        // Set user state first
        setUser(userData)

        // Store in localStorage
        localStorage.setItem("user", JSON.stringify(userData))

        // Then redirect
        router.push("/dashboard")
        return
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const adminLogin = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // We'll keep the hardcoded admin for development/testing purposes
      // but prioritize the API endpoint for real authentication
      if (process.env.NODE_ENV === 'development' && email === "admin@example.com" && password === "Dishbrain2025!") {
        const adminData = {
          id: "admin-1",
          name: "Admin",
          email: "admin@example.com",
          role: "ADMIN" as const,
        }

        setUser(adminData)
        localStorage.setItem("user", JSON.stringify(adminData))
        
        // Redirect directly to admin dashboard
        router.push("/admin/dashboard")
        return
      }
      
      // If not using hardcoded credentials, try the API endpoint
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      if (!response.ok) {
        throw new Error("Invalid admin credentials")
      }
      
      const data = await response.json()

      const adminData = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
      }

      setUser(adminData)
      localStorage.setItem("user", JSON.stringify(adminData))
      
      // Redirect directly to admin dashboard
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Admin login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, adminLogin, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
