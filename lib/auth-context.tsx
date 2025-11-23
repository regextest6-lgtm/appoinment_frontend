"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface User {
  id: number
  phone: string
  full_name?: string
  email?: string
  is_active: boolean
  is_admin: boolean
  is_doctor: boolean
  created_at?: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  refreshToken: string | null
  userType: "patient" | "doctor" | "admin" | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (user: User, token: string, refreshToken: string, type: "patient" | "doctor" | "admin") => void
  logout: () => void
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [userType, setUserType] = useState<"patient" | "doctor" | "admin" | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load auth from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token")
    const storedRefreshToken = localStorage.getItem("refresh_token")
    const storedUser = localStorage.getItem("auth_user")
    const storedUserType = localStorage.getItem("user_type") as "patient" | "doctor" | "admin" | null

    if (storedToken && storedUser) {
      setToken(storedToken)
      setRefreshToken(storedRefreshToken)
      setUser(JSON.parse(storedUser))
      setUserType(storedUserType)
    }

    setIsLoading(false)
  }, [])

  const login = (
    userData: User,
    authToken: string,
    authRefreshToken: string,
    type: "patient" | "doctor" | "admin"
  ) => {
    setUser(userData)
    setToken(authToken)
    setRefreshToken(authRefreshToken)
    setUserType(type)

    localStorage.setItem("auth_token", authToken)
    localStorage.setItem("refresh_token", authRefreshToken)
    localStorage.setItem("auth_user", JSON.stringify(userData))
    localStorage.setItem("user_type", type)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setRefreshToken(null)
    setUserType(null)

    localStorage.removeItem("auth_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("auth_user")
    localStorage.removeItem("user_type")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        userType,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
