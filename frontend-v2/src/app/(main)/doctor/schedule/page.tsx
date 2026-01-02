'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { scheduleService } from '@/lib/services'
import { TIME_SLOTS } from '@/lib/services/allcode.service'
import type { Schedule } from '@/types'
import { formatShortDate, getScheduleStatusName, getScheduleStatusColor } from '@/lib/utils'
import {
  Card, CardContent, Button, Input, Select, Modal,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Spinner, Badge,
} from '@/components/ui'
import { Plus, Trash2, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DoctorSchedulePage() {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    date: '',
    timeType: '',
    maxNumber: '5',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) fetchSchedules()
  }, [user])

  const fetchSchedules = async () => {
    if (!user) return
    try {
      const data = await scheduleService.getByDoctor(user.id, undefined, true)
      setSchedules(data)
    } catch (error) {
      toast.error('Không thể tải lịch làm việc')
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setFormData({
      date: tomorrow.toISOString().split('T')[0],
      timeType: '',
      maxNumber: '5',
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData.date || !formData.timeType) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    setSubmitting(true)
    try {
      await scheduleService.create({
        doctorId: user.id,
        date: formData.date,
        timeType: formData.timeType,
        maxNumber: Number(formData.maxNumber),
      })
      toast.success('Đăng ký lịch thành công, đang chờ Admin duyệt')
      setIsModalOpen(false)
      fetchSchedules()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (schedule: Schedule) => {
    if (schedule.currentNumber > 0) {
      toast.error('Không thể xóa lịch đã có bệnh nhân đặt')
      return
    }
    if (!confirm('Bạn có chắc muốn xóa lịch này?')) return
    
    try {
      await scheduleService.delete(schedule.id)
      toast.success('Xóa thành công')
      fetchSchedules()
    } catch (error) {
      toast.error('Không thể xóa lịch')
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  }

  const pendingCount = schedules.filter((s) => s.status === 'pending').length

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <h1 className="page-title mb-0">Lịch làm việc của tôi</h1>
          {pendingCount > 0 && (
            <Badge variant="warning">{pendingCount} chờ duyệt</Badge>
          )}
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Đăng ký lịch
        </Button>
      </div>

      {schedules.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Bạn chưa có lịch làm việc nào</p>
            <Button onClick={openCreateModal}>
              <Plus className="h-4 w-4 mr-2" />
              Đăng ký lịch làm việc
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Khung giờ</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{formatShortDate(schedule.date)}</TableCell>
                  <TableCell>{schedule.timeTypeData?.valueVi || schedule.timeType}</TableCell>
                  <TableCell>{schedule.currentNumber}/{schedule.maxNumber}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScheduleStatusColor(schedule.status)}`}>
                      {getScheduleStatusName(schedule.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {schedule.currentNumber === 0 && (
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(schedule)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Đăng ký lịch làm việc"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Ngày làm việc"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
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
          <p className="text-sm text-gray-500">
            * Lịch làm việc sẽ được gửi đến Admin để duyệt trước khi hiển thị cho bệnh nhân.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" loading={submitting}>Đăng ký</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
