import { httpClient } from './httpClient'
import type { AuthCredentials, LoginResponse, RegisterResponse } from '../types/auth'

export const authService = {
  login(credentials: AuthCredentials) {
    return httpClient.post<LoginResponse, AuthCredentials>('/auth/login', credentials)
  },
  register(credentials: AuthCredentials) {
    return httpClient.post<RegisterResponse, AuthCredentials>('/auth/register', credentials)
  },
}
