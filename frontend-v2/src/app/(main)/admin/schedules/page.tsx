'use client'

import { useEffect, useState, useMemo } from 'react'
import { scheduleService, doctorService } from '@/lib/services'
import { TIME_SLOTS } from '@/lib/services/allcode.service'
import type { Schedule, User } from '@/types'
import { getFullName, formatShortDate, getScheduleStatusName, getScheduleStatusColor } from '@/lib/utils'
import {
  Button, Input, Select, SlidePanel, DataTable, Spinner,
  PageLayout, PageHeader, PageContent,
} from '@/components/ui'
import { Plus, Trash2, Calendar, Filter, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [doctors, setDoctors] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [filterDoctor, setFilterDoctor] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    timeType: '',
    maxNumber: '5',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [schedulesData, doctorsData] = await Promise.all([
        scheduleService.getAll(),
        doctorService.getAll(),
      ])
      setSchedules(schedulesData)
      setDoctors(doctorsData)
    } catch (error) {
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      if (filterDoctor && s.doctorId !== Number(filterDoctor)) return false
      if (filterStatus && s.status !== filterStatus) return false
      return true
    })
  }, [schedules, filterDoctor, filterStatus])

  const hasFilters = filterDoctor || filterStatus

  const openCreatePanel = () => {
    setFormData({ doctorId: '', date: '', timeType: '', maxNumber: '5' })
    setIsPanelOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.doctorId || !formData.date || !formData.timeType) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    setSubmitting(true)
    try {
      await scheduleService.create({
        doctorId: Number(formData.doctorId),
        date: formData.date,
        timeType: formData.timeType,
        maxNumber: Number(formData.maxNumber),
      })
      toast.success('Tạo lịch khám thành công')
      setIsPanelOpen(false)
      fetchData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (schedule: Schedule, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Bạn có chắc muốn xóa lịch khám này?')) return
    try {
      await scheduleService.delete(schedule.id)
      toast.success('Xóa thành công')
      fetchData()
    } catch (error) {
      toast.error('Không thể xóa lịch khám')
    }
  }

  const clearFilters = () => {
    setFilterDoctor('')
    setFilterStatus('')
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
        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
          {s.timeTypeData?.valueVi || s.timeType}
        </span>
      ),
    },
    {
      key: 'capacity',
      header: 'Số lượng',
      width: 'w-24',
      render: (s: Schedule) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(s.currentNumber / s.maxNumber) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-600 w-10">
            {s.currentNumber}/{s.maxNumber}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: 'w-28',
      render: (s: Schedule) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScheduleStatusColor(s.status)}`}>
          {getScheduleStatusName(s.status)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: 'w-16',
      render: (s: Schedule) => (
        <button
          onClick={(e) => handleDelete(s, e)}
          className="p-1.5 hover:bg-red-50 rounded transition-colors"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </button>
      ),
    },
  ], [])

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
        title="Quản lý lịch khám"
        subtitle={`${filteredSchedules.length} lịch khám`}
        actions={
          <Button onClick={openCreatePanel} size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Tạo lịch khám
          </Button>
        }
      />

      <PageContent noPadding className="flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-3 border-b bg-white">
          <Filter className="h-4 w-4 text-gray-400" />
          
          <select
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
            className="px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả bác sĩ</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>{getFullName(d)}</option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <X className="h-3 w-3" />
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-hidden bg-white">
          <DataTable
            columns={columns}
            data={filteredSchedules}
            keyField="id"
            compact
            emptyMessage="Không có lịch khám nào"
          />
        </div>
      </PageContent>

      {/* Slide Panel for Form */}
      <SlidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title="Tạo lịch khám mới"
        width="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Bác sĩ"
            value={formData.doctorId}
            onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
            options={doctors.map((d) => ({
              value: d.id,
              label: `${getFullName(d)} - ${d.specialtyData?.name || 'Chưa có chuyên khoa'}`,
            }))}
            placeholder="Chọn bác sĩ"
            required
          />
          
          <Input
            label="Ngày khám"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          
          <Select
            label="Khung giờ"
            value={formData.timeType}
            onChange={(e) => setFormData({ ...formData, timeType: e.target.value })}
            options={TIME_SLOTS.map((t) => ({ value: t.keyMap, label: t.valueVi }))}
            placeholder="Chọn khung giờ"
            required
          />
          
          <Input
            label="Số bệnh nhân tối đa"
            type="number"
            min="1"
            max="20"
            value={formData.maxNumber}
            onChange={(e) => setFormData({ ...formData, maxNumber: e.target.value })}
            required
          />

          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPanelOpen(false)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button type="submit" loading={submitting} className="flex-1">
              Tạo lịch
            </Button>
          </div>
        </form>
      </SlidePanel>
    </PageLayout>
  )
}
