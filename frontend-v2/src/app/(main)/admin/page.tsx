'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, Spinner, PageLayout, PageHeader, PageContent } from '@/components/ui'
import { userService, specialtyService, scheduleService } from '@/lib/services'
import { Users, Stethoscope, Calendar, Clock, ArrowRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Stats {
  totalPatients: number
  totalDoctors: number
  totalSpecialties: number
  pendingSchedules: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, specialties, pendingSchedules] = await Promise.all([
          userService.getAllUsers(),
          specialtyService.getAll(),
          scheduleService.getPending(),
        ])

        setStats({
          totalPatients: users.R1.length,
          totalDoctors: users.R2.length,
          totalSpecialties: specialties.length,
          pendingSchedules: pendingSchedules.length,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageLayout>
    )
  }

  const statCards = [
    {
      title: 'Bệnh nhân',
      value: stats?.totalPatients || 0,
      icon: <Users className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/admin/users',
    },
    {
      title: 'Bác sĩ',
      value: stats?.totalDoctors || 0,
      icon: <Stethoscope className="h-6 w-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/admin/users',
    },
    {
      title: 'Chuyên khoa',
      value: stats?.totalSpecialties || 0,
      icon: <Calendar className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/admin/specialties',
    },
    {
      title: 'Chờ duyệt',
      value: stats?.pendingSchedules || 0,
      icon: <Clock className="h-6 w-6" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      href: '/admin/pending-schedules',
      highlight: (stats?.pendingSchedules || 0) > 0,
    },
  ]

  const quickActions = [
    { label: 'Quản lý người dùng', href: '/admin/users', icon: Users },
    { label: 'Quản lý chuyên khoa', href: '/admin/specialties', icon: Stethoscope },
    { label: 'Quản lý lịch khám', href: '/admin/schedules', icon: Calendar },
    { label: 'Duyệt lịch khám', href: '/admin/pending-schedules', icon: Clock },
  ]

  return (
    <PageLayout>
      <PageHeader title="Dashboard" subtitle="Tổng quan hệ thống" />

      <PageContent className="space-y-6">
        {/* Alert for pending schedules */}
        {stats && stats.pendingSchedules > 0 && (
          <Link href="/admin/pending-schedules">
            <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-amber-900">
                    Có {stats.pendingSchedules} lịch khám đang chờ duyệt
                  </p>
                  <p className="text-sm text-amber-700">Nhấn để xem và xử lý</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-amber-600" />
            </div>
          </Link>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <div
                className={`p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer ${
                  stat.highlight ? 'border-amber-300 bg-amber-50' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <span className={stat.color}>{stat.icon}</span>
                  </div>
                  {stat.highlight && (
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-800 text-xs font-medium rounded-full">
                      Cần xử lý
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.title}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Truy cập nhanh
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                  <action.icon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </PageContent>
    </PageLayout>
  )
}
