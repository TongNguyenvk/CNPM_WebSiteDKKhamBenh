// User types
export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  address?: string
  gender?: boolean
  roleId: 'R1' | 'R2' | 'R3'
  phoneNumber?: string
  positionId?: string
  image?: string
  specialtyId?: number
  createdAt?: string
  updatedAt?: string
  roleData?: Allcode
  positionData?: Allcode
  specialtyData?: Specialty
  doctorDetail?: DoctorDetail
}

export interface DoctorDetail {
  doctorId: number
  descriptionMarkdown?: string
  descriptionHTML?: string
}

// Specialty types
export interface Specialty {
  id: number
  name: string
  image?: string
  description?: string
}

// Schedule types
export type ScheduleStatus = 'pending' | 'approved' | 'rejected'

export interface Schedule {
  id: number
  doctorId: number
  date: string
  timeType: string
  maxNumber: number
  currentNumber: number
  status: ScheduleStatus
  createdAt?: string
  updatedAt?: string
  doctorData?: User
  timeTypeData?: {
    valueVi: string
    valueEn: string
  }
}

// Booking types
export type BookingStatus = 'S1' | 'S2' | 'S3' | 'S4'

export interface Booking {
  id: number
  statusId: BookingStatus
  doctorId: number
  patientId: number
  date: string
  timeType: string
  token?: string
  createdAt?: string
  updatedAt?: string
  doctorData?: User
  patientData?: User
  statusData?: Allcode
  timeTypeData?: Allcode
}

// Allcode types
export interface Allcode {
  id?: number
  keyMap: string
  type: string
  valueVi: string
  valueEn: string
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  token: string
  userId: number
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  gender?: boolean
  phoneNumber?: string
  address?: string
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
