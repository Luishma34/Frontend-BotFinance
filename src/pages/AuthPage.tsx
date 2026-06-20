import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { HttpError } from '../services/httpClient'

type AuthMode = 'login' | 'register'

const getAuthErrorMessage = (error: unknown) => {
  if (error instanceof HttpError) {
    if (error.status === 409) {
      return 'Usuário já existe. Tente entrar com sua conta.'
    }

    if (error.status === 400 || error.status === 401) {
      return 'Usuário ou senha inválidos.'
    }

    return error.message
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Não foi possível concluir a autenticação. Tente novamente.'
}

const getEmailValidationError = (email: string): string | null => {
  const trimmed = email.trim()
  if (!trimmed) return 'Email é obrigatório'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Email inválido'
  return null
}

const getUsernameValidationError = (username: string): string | null => {
  const trimmed = username.trim()
  if (!trimmed) return 'Usuário é obrigatório'
  if (trimmed.length < 3) return 'Usuário deve ter no mínimo 3 caracteres'
  return null
}

const getPasswordValidationError = (password: string): string | null => {
  if (!password) return 'Senha é obrigatória'
  if (password.length < 6) return 'Senha deve ter no mínimo 6 caracteres'
  return null
}

const AuthPage = () => {
  const { isAuthenticated, isLoading, login, register } = useAuth()
  const location = useLocation()
  const fromPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'
  const [mode, setMode] = useState<AuthMode>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [touched, setTouched] = useState({ username: false, password: false, email: false })

  const normalizedUsername = useMemo(() => username.trim(), [username])
  const normalizedEmail = useMemo(() => email.trim(), [email])
  
  const usernameError = touched.username ? getUsernameValidationError(username) : null
  const passwordError = touched.password ? getPasswordValidationError(password) : null
  const emailError = mode === 'register' && touched.email ? getEmailValidationError(email) : null
  
  const canSubmit = mode === 'login' 
    ? normalizedUsername.length >= 3 && password.length >= 6 && !isLoading
    : normalizedUsername.length >= 3 && password.length >= 6 && normalizedEmail.length > 0 && !getEmailValidationError(normalizedEmail) && !isLoading

  if (isAuthenticated) {
    return <Navigate to={fromPath} replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    setErrorMessage(null)

    try {
      if (mode === 'login') {
        await login(normalizedUsername, password)
      } else {
        await register(normalizedUsername, password, normalizedEmail)
      }
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error))
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-label="Autenticação">
        <h1>BotFinance</h1>
        <p className="auth-subtitle">Acesse sua conta para continuar.</p>

        <div className="auth-mode-switch" role="tablist" aria-label="Escolher tipo de acesso">
          <button
            type="button"
            className={mode === 'login' ? 'btn-auth-mode active' : 'btn-auth-mode'}
            onClick={() => {
              setMode('login')
              setEmail('')
              setErrorMessage(null)
            }}
          >
            Entrar
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'btn-auth-mode active' : 'btn-auth-mode'}
            onClick={() => {
              setMode('register')
              setErrorMessage(null)
            }}
          >
            Criar conta
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="username">
            Usuário
          </label>
          <input
            id="username"
            type="text"
            className={`auth-input ${usernameError ? 'auth-input-error' : ''}`}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            onBlur={() => setTouched({ ...touched, username: true })}
            minLength={3}
            autoComplete="username"
            required
          />
          {usernameError ? <p className="auth-error">{usernameError}</p> : null}

          {mode === 'register' && (
            <>
              <label className="auth-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`auth-input ${emailError ? 'auth-input-error' : ''}`}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => setTouched({ ...touched, email: true })}
                autoComplete="email"
                required
              />
              {emailError ? <p className="auth-error">{emailError}</p> : null}
            </>
          )}

          <label className="auth-label" htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            type="password"
            className={`auth-input ${passwordError ? 'auth-input-error' : ''}`}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onBlur={() => setTouched({ ...touched, password: true })}
            minLength={6}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
          />
          {passwordError ? <p className="auth-error">{passwordError}</p> : null}

          {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}

          <button type="submit" className="btn-primary btn-block" disabled={!canSubmit}>
            {isLoading ? 'Carregando...' : mode === 'login' ? 'Entrar' : 'Criar conta e entrar'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default AuthPage
