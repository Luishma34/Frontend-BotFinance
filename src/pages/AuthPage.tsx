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

const AuthPage = () => {
  const { isAuthenticated, isLoading, login, register } = useAuth()
  const location = useLocation()
  const fromPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'
  const [mode, setMode] = useState<AuthMode>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const normalizedUsername = useMemo(() => username.trim(), [username])
  const canSubmit = normalizedUsername.length >= 3 && password.length >= 6 && !isLoading

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
        await register(normalizedUsername, password)
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
            onClick={() => setMode('login')}
          >
            Entrar
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'btn-auth-mode active' : 'btn-auth-mode'}
            onClick={() => setMode('register')}
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
            className="auth-input"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            minLength={3}
            autoComplete="username"
            required
          />

          <label className="auth-label" htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            type="password"
            className="auth-input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
          />

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
