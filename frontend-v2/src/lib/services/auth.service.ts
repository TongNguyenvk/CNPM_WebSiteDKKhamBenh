import api from '@/lib/api'
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '@/types'

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data)
    return response.data
  },

  async register(data: RegisterRequest): Promise<{ message: string; userId: number }> {
    const response = await api.post('/users/register-patient', data)
    return response.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me')
    return response.data
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },
}
