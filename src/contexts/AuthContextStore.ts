import { createContext } from 'react'

export interface AuthContextValue {
  isAuthenticated: boolean
  isLoading: boolean
  username: string | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
