type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

interface RequestOptions<B = unknown> {
  method: HttpMethod
  path: string
  body?: B
  token?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export class HttpError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

const buildUrl = (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  if (path.startsWith('/')) {
    return `${API_BASE_URL}${path}`
  }

  return `${API_BASE_URL}/${path}`
}

const getErrorMessage = (payload: unknown, status: number) => {
  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }

  if (payload && typeof payload === 'object' && 'detail' in payload) {
    const detail = payload.detail
    if (typeof detail === 'string' && detail.trim()) {
      return detail
    }
  }

  return `Erro na requisição (${status})`
}

const request = async <T, B = unknown>({ method, path, body, token }: RequestOptions<B>): Promise<T> => {
  const response = await fetch(buildUrl(path), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await response.text()
  let payload: unknown = null

  if (text) {
    try {
      payload = JSON.parse(text) as unknown
    } catch {
      payload = text
    }
  }

  if (!response.ok) {
    throw new HttpError(getErrorMessage(payload, response.status), response.status)
  }

  return payload as T
}

export const httpClient = {
  get: <T>(path: string, token?: string) => request<T>({ method: 'GET', path, token }),
  post: <T, B = unknown>(path: string, body: B, token?: string) =>
    request<T, B>({ method: 'POST', path, body, token }),
  patch: <T, B = unknown>(path: string, body: B, token?: string) =>
    request<T, B>({ method: 'PATCH', path, body, token }),
  put: <T, B = unknown>(path: string, body: B, token?: string) =>
    request<T, B>({ method: 'PUT', path, body, token }),
  delete: <T>(path: string, token?: string) => request<T>({ method: 'DELETE', path, token }),
}
