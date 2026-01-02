'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  ClipboardList,
  Settings,
  Clock,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  roles: string[]
}

const navItems: NavItem[] = [
  // Admin items
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="h-5 w-5" />, roles: ['R3'] },
  { label: 'Người dùng', href: '/admin/users', icon: <Users className="h-5 w-5" />, roles: ['R3'] },
  { label: 'Chuyên khoa', href: '/admin/specialties', icon: <Stethoscope className="h-5 w-5" />, roles: ['R3'] },
  { label: 'Lịch khám', href: '/admin/schedules', icon: <Calendar className="h-5 w-5" />, roles: ['R3'] },
  { label: 'Duyệt lịch', href: '/admin/pending-schedules', icon: <Clock className="h-5 w-5" />, roles: ['R3'] },
  
  // Doctor items
  { label: 'Dashboard', href: '/doctor', icon: <LayoutDashboard className="h-5 w-5" />, roles: ['R2'] },
  { label: 'Lịch làm việc', href: '/doctor/schedule', icon: <Calendar className="h-5 w-5" />, roles: ['R2'] },
  { label: 'Lịch hẹn', href: '/doctor/bookings', icon: <ClipboardList className="h-5 w-5" />, roles: ['R2'] },
  
  // Patient items
  { label: 'Trang chủ', href: '/patient', icon: <LayoutDashboard className="h-5 w-5" />, roles: ['R1'] },
  { label: 'Chuyên khoa', href: '/patient/specialties', icon: <Stethoscope className="h-5 w-5" />, roles: ['R1'] },
  { label: 'Bác sĩ', href: '/patient/doctors', icon: <Users className="h-5 w-5" />, roles: ['R1'] },
  { label: 'Lịch hẹn của tôi', href: '/patient/bookings', icon: <ClipboardList className="h-5 w-5" />, roles: ['R1'] },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const filteredItems = navItems.filter(
    (item) => user && item.roles.includes(user.roleId)
  )

  return (
    <aside className="w-60 bg-white border-r flex-shrink-0 hidden lg:flex flex-col">
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && item.href !== '/doctor' && item.href !== '/patient' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm',
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
