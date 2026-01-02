'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Header, Sidebar } from '@/components/layout'
import { Spinner } from '@/components/ui'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Check role-based access
    if (user) {
      const isAdminRoute = pathname.startsWith('/admin')
      const isDoctorRoute = pathname.startsWith('/doctor')
      const isPatientRoute = pathname.startsWith('/patient')

      if (isAdminRoute && user.roleId !== 'R3') {
        router.push(user.roleId === 'R2' ? '/doctor' : '/patient')
      } else if (isDoctorRoute && user.roleId !== 'R2') {
        router.push(user.roleId === 'R3' ? '/admin' : '/patient')
      } else if (isPatientRoute && user.roleId !== 'R1') {
        router.push(user.roleId === 'R3' ? '/admin' : '/doctor')
      }
    }
  }, [isAuthenticated, user, pathname, router])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
