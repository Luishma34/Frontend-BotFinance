export interface AuthCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface RegisterResponse {
  id: string
  username: string
}

export interface AuthSession {
  token: string
  username: string
}
