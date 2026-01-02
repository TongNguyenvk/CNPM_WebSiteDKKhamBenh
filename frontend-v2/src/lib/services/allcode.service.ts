import api from '@/lib/api'
import type { Allcode } from '@/types'

interface AllcodeResponse {
  message: string
  data: Allcode[]
}

export const allcodeService = {
  async getByType(type: string): Promise<Allcode[]> {
    const response = await api.get<AllcodeResponse>(`/allcode/type?type=${type}`)
    return response.data.data
  },

  async getAllTypes(): Promise<string[]> {
    const response = await api.get<{ message: string; data: string[] }>('/allcode/types')
    return response.data.data
  },
}

// Time slots constant (can be used without API call)
export const TIME_SLOTS: Allcode[] = [
  { keyMap: 'T1', type: 'TIME', valueVi: '08:00 - 09:00', valueEn: '08:00 - 09:00' },
  { keyMap: 'T2', type: 'TIME', valueVi: '09:00 - 10:00', valueEn: '09:00 - 10:00' },
  { keyMap: 'T3', type: 'TIME', valueVi: '10:00 - 11:00', valueEn: '10:00 - 11:00' },
  { keyMap: 'T4', type: 'TIME', valueVi: '11:00 - 12:00', valueEn: '11:00 - 12:00' },
  { keyMap: 'T5', type: 'TIME', valueVi: '13:00 - 14:00', valueEn: '13:00 - 14:00' },
  { keyMap: 'T6', type: 'TIME', valueVi: '14:00 - 15:00', valueEn: '14:00 - 15:00' },
  { keyMap: 'T7', type: 'TIME', valueVi: '15:00 - 16:00', valueEn: '15:00 - 16:00' },
  { keyMap: 'T8', type: 'TIME', valueVi: '16:00 - 17:00', valueEn: '16:00 - 17:00' },
]

export const POSITIONS: Allcode[] = [
  { keyMap: 'P0', type: 'POSITION', valueVi: 'Không có', valueEn: 'None' },
  { keyMap: 'P1', type: 'POSITION', valueVi: 'Bác sĩ', valueEn: 'Doctor' },
  { keyMap: 'P2', type: 'POSITION', valueVi: 'Thạc sĩ', valueEn: 'Master' },
  { keyMap: 'P3', type: 'POSITION', valueVi: 'Tiến sĩ', valueEn: 'PhD' },
  { keyMap: 'P4', type: 'POSITION', valueVi: 'Phó Giáo sư', valueEn: 'Associate Professor' },
  { keyMap: 'P5', type: 'POSITION', valueVi: 'Giáo sư', valueEn: 'Professor' },
]
