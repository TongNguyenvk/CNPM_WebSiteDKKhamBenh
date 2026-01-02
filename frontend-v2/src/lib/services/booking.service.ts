import api from '@/lib/api'
import type { Booking, BookingStatus } from '@/types'

interface BookingResponse {
  success: boolean
  data: Booking | Booking[]
}

export const bookingService = {
  async create(data: {
    doctorId: number
    patientId: number
    date: string
    timeType: string
    statusId?: string
  }): Promise<Booking> {
    const response = await api.post<BookingResponse>('/bookings', {
      ...data,
      statusId: data.statusId || 'S1',
    })
    return response.data.data as Booking
  },

  async getById(id: number): Promise<Booking> {
    const response = await api.get<BookingResponse>(`/bookings/${id}`)
    return response.data.data as Booking
  },

  async getByDoctor(doctorId: number): Promise<Booking[]> {
    const response = await api.get<BookingResponse>(`/bookings/doctor/${doctorId}`)
    return response.data.data as Booking[]
  },

  async getByPatient(patientId: number): Promise<Booking[]> {
    const response = await api.get<BookingResponse>(`/bookings/patient/${patientId}`)
    return response.data.data as Booking[]
  },

  async updateStatus(id: number, statusId: BookingStatus): Promise<Booking> {
    const response = await api.put<BookingResponse>(`/bookings/${id}/status`, { statusId })
    return response.data.data as Booking
  },

  async cancel(id: number): Promise<Booking> {
    const response = await api.put<BookingResponse>(`/bookings/cancel/${id}`)
    return response.data.data as Booking
  },
}
