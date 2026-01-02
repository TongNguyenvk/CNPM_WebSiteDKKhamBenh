import api from '@/lib/api'
import type { Specialty } from '@/types'

export const specialtyService = {
  async getAll(): Promise<Specialty[]> {
    const response = await api.get<Specialty[]>('/specialties')
    return response.data
  },

  async getById(id: number): Promise<Specialty> {
    const response = await api.get<Specialty>(`/specialties/${id}`)
    return response.data
  },

  async create(data: { name: string; description?: string; image?: string }): Promise<Specialty> {
    const response = await api.post('/specialties', data)
    return response.data.specialty
  },

  async update(id: number, data: { name?: string; description?: string }): Promise<Specialty> {
    const response = await api.put(`/specialties/${id}`, data)
    return response.data.specialty
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/specialties/${id}`)
  },
}
