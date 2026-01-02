'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui'
import Link from 'next/link'
import { Calendar, Users, Stethoscope, Clock } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.roleId) {
        case 'R1':
          router.push('/patient')
          break
        case 'R2':
          router.push('/doctor')
          break
        case 'R3':
          router.push('/admin')
          break
      }
    }
  }, [isAuthenticated, user, router])

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Medical Booking</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 px-4 py-2">
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Đặt lịch khám bệnh <span className="text-primary-600">trực tuyến</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Hệ thống đặt lịch khám bệnh hiện đại, giúp bạn dễ dàng tìm kiếm bác sĩ 
            và đặt lịch hẹn nhanh chóng, thuận tiện.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-3 bg-primary-600 text-white text-lg font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Bắt đầu ngay
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Stethoscope className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Nhiều chuyên khoa</h3>
            <p className="text-gray-600">Đa dạng các chuyên khoa để bạn lựa chọn phù hợp với nhu cầu</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Bác sĩ chuyên nghiệp</h3>
            <p className="text-gray-600">Đội ngũ bác sĩ giàu kinh nghiệm, tận tâm với bệnh nhân</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Đặt lịch dễ dàng</h3>
            <p className="text-gray-600">Chỉ vài bước đơn giản để đặt lịch hẹn khám bệnh</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Tiết kiệm thời gian</h3>
            <p className="text-gray-600">Không cần xếp hàng, chờ đợi tại bệnh viện</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Medical Booking. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
