import api from '@/lib/api'
import type { User } from '@/types'

export const doctorService = {
  async getAll(): Promise<User[]> {
    const response = await api.get<User[]>('/doctor')
    return response.data
  },

  async getById(id: number): Promise<User> {
    const response = await api.get<User>(`/doctor/${id}`)
    return response.data
  },

  async getBySpecialty(specialtyId: number): Promise<User[]> {
    const response = await api.get<User[]>(`/doctor/specialty/${specialtyId}`)
    return response.data
  },

  async update(id: number, data: Partial<User & { descriptionMarkdown?: string; descriptionHTML?: string }>): Promise<User> {
    const response = await api.put(`/doctor/${id}`, data)
    return response.data.doctor
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/doctor/${id}`)
  },
}
