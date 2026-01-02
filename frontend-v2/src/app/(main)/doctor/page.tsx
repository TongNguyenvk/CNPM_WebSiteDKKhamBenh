'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { scheduleService, bookingService } from '@/lib/services'
import type { Schedule, Booking } from '@/types'
import { Card, CardContent, Spinner } from '@/components/ui'
import { Calendar, ClipboardList, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface Stats {
  totalSchedules: number
  pendingSchedules: number
  todayBookings: number
  completedBookings: number
}

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchStats = async () => {
      try {
        const [schedules, bookings] = await Promise.all([
          scheduleService.getByDoctor(user.id, undefined, true),
          bookingService.getByDoctor(user.id),
        ])

        const today = new Date().toISOString().split('T')[0]
        const todayBookings = bookings.filter(
          (b) => new Date(b.date).toISOString().split('T')[0] === today
        )

        setStats({
          totalSchedules: schedules.length,
          pendingSchedules: schedules.filter((s) => s.status === 'pending').length,
          todayBookings: todayBookings.length,
          completedBookings: bookings.filter((b) => b.statusId === 'S4').length,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Tổng lịch làm việc',
      value: stats?.totalSchedules || 0,
      icon: <Calendar className="h-8 w-8 text-blue-600" />,
      bgColor: 'bg-blue-50',
      href: '/doctor/schedule',
    },
    {
      title: 'Lịch chờ duyệt',
      value: stats?.pendingSchedules || 0,
      icon: <Clock className="h-8 w-8 text-yellow-600" />,
      bgColor: 'bg-yellow-50',
      href: '/doctor/schedule',
    },
    {
      title: 'Lịch hẹn hôm nay',
      value: stats?.todayBookings || 0,
      icon: <ClipboardList className="h-8 w-8 text-green-600" />,
      bgColor: 'bg-green-50',
      href: '/doctor/bookings',
    },
    {
      title: 'Đã hoàn thành',
      value: stats?.completedBookings || 0,
      icon: <CheckCircle className="h-8 w-8 text-purple-600" />,
      bgColor: 'bg-purple-50',
      href: '/doctor/bookings',
    },
  ]

  return (
    <div className="page-container">
      <h1 className="page-title">Dashboard Bác sĩ</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center space-x-4 py-6">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>{stat.icon}</div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {stats && stats.pendingSchedules > 0 && (
        <div className="mt-8">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="py-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-yellow-600" />
                <span className="text-yellow-800">
                  Bạn có {stats.pendingSchedules} lịch làm việc đang chờ Admin duyệt
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
