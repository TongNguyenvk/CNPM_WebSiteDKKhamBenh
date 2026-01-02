'use client'

import { useEffect, useState, useMemo } from 'react'
import { scheduleService } from '@/lib/services'
import type { Schedule } from '@/types'
import { getFullName, formatShortDate } from '@/lib/utils'
import {
  Button, DataTable, Spinner, Badge,
  PageLayout, PageHeader, PageContent,
} from '@/components/ui'
import { Check, X, Clock, Calendar, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PendingSchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)

  useEffect(() => {
    fetchPendingSchedules()
  }, [])

  const fetchPendingSchedules = async () => {
    try {
      const data = await scheduleService.getPending()
      setSchedules(data)
    } catch (error) {
      toast.error('Không thể tải danh sách lịch chờ duyệt')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (schedule: Schedule, e: React.MouseEvent) => {
    e.stopPropagation()
    setProcessingId(schedule.id)
    try {
      await scheduleService.approve(schedule.id)
      toast.success('Đã duyệt lịch khám')
      setSchedules(schedules.filter((s) => s.id !== schedule.id))
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (schedule: Schedule, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Bạn có chắc muốn từ chối lịch khám này?')) return
    
    setProcessingId(schedule.id)
    try {
      await scheduleService.reject(schedule.id)
      toast.success('Đã từ chối lịch khám')
      setSchedules(schedules.filter((s) => s.id !== schedule.id))
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setProcessingId(null)
    }
  }

  const handleApproveAll = async () => {
    if (!confirm(`Bạn có chắc muốn duyệt tất cả ${schedules.length} lịch khám?`)) return
    
    setProcessingId(-1)
    try {
      await Promise.all(schedules.map((s) => scheduleService.approve(s.id)))
      toast.success('Đã duyệt tất cả lịch khám')
      setSchedules([])
    } catch (error: any) {
      toast.error('Có lỗi xảy ra khi duyệt')
      fetchPendingSchedules()
    } finally {
      setProcessingId(null)
    }
  }

  const columns = useMemo(() => [
    {
      key: 'date',
      header: 'Ngày',
      width: 'w-28',
      render: (s: Schedule) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{formatShortDate(s.date)}</span>
        </div>
      ),
    },
    {
      key: 'doctor',
      header: 'Bác sĩ',
      render: (s: Schedule) => (
        <div>
          <div className="font-medium text-gray-900">
            {s.doctorData ? getFullName(s.doctorData) : '-'}
          </div>
          <div className="text-xs text-gray-500">
            {s.doctorData?.specialtyData?.name || ''}
          </div>
        </div>
      ),
    },
    {
      key: 'timeType',
      header: 'Khung giờ',
      render: (s: Schedule) => (
        <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-medium">
          {s.timeTypeData?.valueVi || s.timeType}
        </span>
      ),
    },
    {
      key: 'maxNumber',
      header: 'Số lượng tối đa',
      width: 'w-32',
      render: (s: Schedule) => (
        <span className="text-gray-600">{s.maxNumber} bệnh nhân</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: 'w-40',
      render: (s: Schedule) => (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            onClick={(e) => handleApprove(s, e)}
            disabled={processingId !== null}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="h-4 w-4 mr-1" />
            Duyệt
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => handleReject(s, e)}
            disabled={processingId !== null}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], [processingId, schedules])

  if (loading) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageHeader
        title="Duyệt lịch khám"
        subtitle={schedules.length > 0 ? `${schedules.length} lịch đang chờ duyệt` : 'Không có lịch chờ duyệt'}
        actions={
          schedules.length > 1 && (
            <Button
              onClick={handleApproveAll}
              disabled={processingId !== null}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-1.5" />
              Duyệt tất cả ({schedules.length})
            </Button>
          )
        }
      />

      <PageContent noPadding className="flex flex-col">
        {schedules.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Clock className="h-8 w-8" />
            </div>
            <p className="text-lg font-medium text-gray-600">Không có lịch chờ duyệt</p>
            <p className="text-sm mt-1">Tất cả lịch khám đã được xử lý</p>
          </div>
        ) : (
          <>
            {/* Alert banner */}
            <div className="flex items-center gap-3 px-6 py-3 bg-amber-50 border-b border-amber-100">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <span className="text-sm text-amber-800">
                Có {schedules.length} lịch khám đang chờ bạn duyệt
              </span>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-hidden bg-white">
              <DataTable
                columns={columns}
                data={schedules}
                keyField="id"
                compact
              />
            </div>
          </>
        )}
      </PageContent>
    </PageLayout>
  )
}
