import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'error',
    completed: 'success',
    active: 'success',
    inactive: 'neutral',
  };
  return statusColors[status.toLowerCase()] || 'neutral';
}

export function getStatusText(status: string): string {
  const statusTexts: Record<string, string> = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    cancelled: 'Đã hủy',
    completed: 'Hoàn thành',
    active: 'Hoạt động',
    inactive: 'Không hoạt động',
  };
  return statusTexts[status.toLowerCase()] || status;
}

export function getRoleText(role: string): string {
  const roleTexts: Record<string, string> = {
    R1: 'Bệnh nhân',
    R2: 'Bác sĩ',
    R3: 'Quản trị viên',
    patient: 'Bệnh nhân',
    doctor: 'Bác sĩ',
    admin: 'Quản trị viên',
  };
  return roleTexts[role] || role;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// API Base URL - remove trailing /api if present
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/api\/?$/, '');

/**
 * Get full image URL from backend
 * @param imagePath - The image path stored in database (e.g., "/uploads/avatars/xxx.jpg" or "uploads/avatars/xxx.jpg")
 * @param type - Type of image: 'avatar' | 'specialty' | 'auto' (auto-detect from path)
 * @returns Full URL to the image
 */
export function getImageUrl(imagePath: string | null | undefined, type: 'avatar' | 'specialty' | 'auto' = 'auto'): string {
  // Return default image if no path provided
  if (!imagePath) {
    return type === 'specialty' ? '/images/default-specialty.jpg' : '/images/default-avatar.png';
  }

  // If already a full URL (http/https), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Normalize the path - remove leading slash if present
  let normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  // If path already contains /uploads/, use it directly
  if (normalizedPath.includes('/uploads/')) {
    return `${API_BASE_URL}${normalizedPath}`;
  }

  // Otherwise, construct the path based on type
  if (type === 'auto') {
    // Try to detect type from path
    if (normalizedPath.includes('avatar') || normalizedPath.includes('user')) {
      type = 'avatar';
    } else if (normalizedPath.includes('specialty') || normalizedPath.includes('specialties')) {
      type = 'specialty';
    } else {
      // Default to avatar for user images
      type = 'avatar';
    }
  }

  // Construct full URL
  const folder = type === 'specialty' ? 'specialties' : 'avatars';
  
  // If path is just a filename, add the folder
  if (!normalizedPath.includes('/')) {
    return `${API_BASE_URL}/uploads/${folder}/${imagePath}`;
  }

  return `${API_BASE_URL}${normalizedPath}`;
}

/**
 * Get avatar URL for a user
 */
export function getAvatarUrl(imagePath: string | null | undefined): string {
  return getImageUrl(imagePath, 'avatar');
}

/**
 * Get specialty image URL
 */
export function getSpecialtyImageUrl(imagePath: string | null | undefined): string {
  return getImageUrl(imagePath, 'specialty');
}
