import api from '@/lib/api'
import type { User } from '@/types'

interface GroupedUsers {
  R1: User[]
  R2: User[]
  R3: User[]
}

export const userService = {
  async getAllUsers(): Promise<GroupedUsers> {
    const response = await api.get<{ success: boolean; data: GroupedUsers }>('/users/all')
    return response.data.data
  },

  async getUser(id: number): Promise<User> {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  },

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${id}`, data)
    return response.data.user
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`)
  },

  async registerDoctor(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    gender?: boolean
    phoneNumber?: string
    address?: string
    positionId?: string
    specialtyId?: number
    descriptionMarkdown?: string
    descriptionHTML?: string
  }): Promise<{ message: string; userId: number }> {
    const response = await api.post('/users/register-doctor', data)
    return response.data
  },

  async registerAdmin(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    gender?: boolean
    phoneNumber?: string
    address?: string
  }): Promise<{ message: string; userId: number }> {
    const response = await api.post('/users/register-admin', data)
    return response.data
  },
}
