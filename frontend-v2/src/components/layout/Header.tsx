'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getFullName, getRoleName } from '@/lib/utils'
import { LogOut, User, Menu } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const getDashboardLink = () => {
    if (!user) return '/'
    switch (user.roleId) {
      case 'R1': return '/patient'
      case 'R2': return '/doctor'
      case 'R3': return '/admin'
      default: return '/'
    }
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={getDashboardLink()} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="font-semibold text-gray-900 hidden sm:block">Medical Booking</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <Link
                  href={getDashboardLink()}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-3 pl-4 border-l">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{getFullName(user)}</p>
                    <p className="text-xs text-gray-500">{getRoleName(user.roleId)}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 px-4 py-2"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 text-sm text-gray-500">
                  {getFullName(user)} - {getRoleName(user.roleId)}
                </div>
                <Link
                  href={getDashboardLink()}
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 bg-primary-600 text-white rounded-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
