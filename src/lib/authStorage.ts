import type { AuthSession } from '../types/auth'

const AUTH_STORAGE_KEY = 'botfinance.auth.session'

export const authStorage = {
  getSession(): AuthSession | null {
    const rawValue = localStorage.getItem(AUTH_STORAGE_KEY)

    if (!rawValue) {
      return null
    }

    try {
      const parsedValue = JSON.parse(rawValue) as Partial<AuthSession>

      if (typeof parsedValue.token !== 'string' || typeof parsedValue.username !== 'string') {
        return null
      }

      return {
        token: parsedValue.token,
        username: parsedValue.username,
      }
    } catch {
      return null
    }
  },
  setSession(session: AuthSession) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
  },
  clearSession() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  },
}
