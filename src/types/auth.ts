export interface AuthCredentials {
  username: string
  password: string
}

export interface RegisterCredentials {
  username: string
  password: string
  email: string
}

export interface LoginResponse {
  token: string
  email: string
  username: string
}

export interface RegisterResponse {
  id: string
  username: string
  email: string
}

export interface AuthSession {
  token: string
  username: string
  email: string
}
