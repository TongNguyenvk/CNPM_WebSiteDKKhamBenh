import api from '@/lib/api'
import type { Schedule } from '@/types'

interface ScheduleResponse {
  success: boolean
  data: Schedule[]
  count?: number
}

export const scheduleService = {
  async getAll(): Promise<Schedule[]> {
    const response = await api.get<ScheduleResponse>('/schedules')
    return response.data.data
  },

  async getById(id: number): Promise<Schedule> {
    const response = await api.get<Schedule>(`/schedules/${id}`)
    return response.data
  },

  async getByDoctor(doctorId: number, date?: string, includeAll = false): Promise<Schedule[]> {
    const params = new URLSearchParams()
    if (date) params.append('date', date)
    if (includeAll) params.append('includeAll', 'true')
    const response = await api.get<ScheduleResponse>(`/schedules/doctor/${doctorId}?${params}`)
    return response.data.data
  },

  async create(data: {
    doctorId: number
    date: string
    timeType: string
    maxNumber: number
  }): Promise<Schedule> {
    const response = await api.post<{ success: boolean; data: Schedule }>('/schedules', data)
    return response.data.data
  },

  async update(id: number, data: Partial<Schedule>): Promise<Schedule> {
    const response = await api.put(`/schedules/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/schedules/${id}`)
  },

  // Admin only
  async getPending(): Promise<Schedule[]> {
    const response = await api.get<ScheduleResponse>('/schedules/pending/list')
    return response.data.data
  },

  async approve(id: number): Promise<Schedule> {
    const response = await api.put<{ success: boolean; data: Schedule }>(`/schedules/${id}/approve`)
    return response.data.data
  },

  async reject(id: number): Promise<Schedule> {
    const response = await api.put<{ success: boolean; data: Schedule }>(`/schedules/${id}/reject`)
    return response.data.data
  },
}
