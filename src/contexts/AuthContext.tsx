import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { authService } from '../services/authService'
import { authStorage } from '../lib/authStorage'
import type { AuthSession } from '../types/auth'
import { AuthContext } from './AuthContextStore'
import type { AuthContextValue } from './AuthContextStore'

interface AuthProviderProps {
  children: ReactNode
}

const createSession = (token: string, username: string, email: string): AuthSession => ({ token, username, email })

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<AuthSession | null>(() => authStorage.getSession())
  const [isLoading, setIsLoading] = useState(false)

  const saveSession = useCallback((nextSession: AuthSession) => {
    authStorage.setSession(nextSession)
    setSession(nextSession)
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true)

    try {
      const response = await authService.login({ username, password })
      saveSession(createSession(response.token, response.username, response.email))
    } finally {
      setIsLoading(false)
    }
  }, [saveSession])

  const register = useCallback(async (username: string, password: string, email: string) => {
    setIsLoading(true)

    try {
      await authService.register({ username, password, email })
      const response = await authService.login({ username, password })
      saveSession(createSession(response.token, response.username, response.email))
    } finally {
      setIsLoading(false)
    }
  }, [saveSession])

  const logout = useCallback(() => {
    authStorage.clearSession()
    setSession(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(session?.token),
      isLoading,
      username: session?.username ?? null,
      email: session?.email ?? null,
      token: session?.token ?? null,
      login,
      register,
      logout,
    }),
    [isLoading, login, logout, register, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

