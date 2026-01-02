import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, locale = 'vi-VN'): string {
  return new Date(date).toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatShortDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function getFullName(user: { firstName?: string; lastName?: string } | null): string {
  if (!user) return ''
  return `${user.lastName || ''} ${user.firstName || ''}`.trim()
}

export function getRoleName(roleId: string): string {
  const roles: Record<string, string> = {
    R1: 'Bệnh nhân',
    R2: 'Bác sĩ',
    R3: 'Quản trị viên',
  }
  return roles[roleId] || roleId
}

export function getStatusName(statusId: string): string {
  const statuses: Record<string, string> = {
    S1: 'Chờ xác nhận',
    S2: 'Đã xác nhận',
    S3: 'Đã hủy',
    S4: 'Đã hoàn thành',
  }
  return statuses[statusId] || statusId
}

export function getStatusColor(statusId: string): string {
  const colors: Record<string, string> = {
    S1: 'bg-yellow-100 text-yellow-800',
    S2: 'bg-green-100 text-green-800',
    S3: 'bg-red-100 text-red-800',
    S4: 'bg-blue-100 text-blue-800',
  }
  return colors[statusId] || 'bg-gray-100 text-gray-800'
}

export function getScheduleStatusName(status: string): string {
  const statuses: Record<string, string> = {
    pending: 'Chờ duyệt',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
  }
  return statuses[status] || status
}

export function getScheduleStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
