import { httpClient } from './httpClient'
import type { AuthCredentials, RegisterCredentials, LoginResponse, RegisterResponse } from '../types/auth'

export const authService = {
  login(credentials: AuthCredentials) {
    return httpClient.post<LoginResponse, AuthCredentials>('/auth/login', credentials)
  },
  register(credentials: RegisterCredentials) {
    return httpClient.post<RegisterResponse, RegisterCredentials>('/auth/register', credentials)
  },
}
