import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getAuthRepository, type AuthUser } from '../lib/auth-repository'

interface AuthContextType {
  isAuthenticated: boolean
  user: AuthUser | null
  accessToken: string | null
  loading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const authRepository = useMemo(() => getAuthRepository(), [])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const session = authRepository.restoreSession()

      if (session) {
        setUser(session.user)
        setAccessToken(session.accessToken)
        setIsAuthenticated(true)
      }
    } catch (err) {
      console.error('Auth restore error:', err)
    } finally {
      setLoading(false)
    }
  }, [authRepository])

  const login = async (username: string, password: string) => {
    try {
      setError(null)
      setLoading(true)
      const session = await authRepository.login({ username, password })
      setUser(session.user)
      setAccessToken(session.accessToken)
      setIsAuthenticated(true)
      return true
    } catch (err) {
      console.error('Login error:', err)
      setError('Usuario o contrasena invalidos')
      setIsAuthenticated(false)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await authRepository.logout()
      setUser(null)
      setAccessToken(null)
      setIsAuthenticated(false)
      setError(null)
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        accessToken,
        loading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
