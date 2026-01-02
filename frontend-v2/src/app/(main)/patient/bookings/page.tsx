'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { bookingService } from '@/lib/services'
import type { Booking } from '@/types'
import { getFullName, formatShortDate, getStatusName, getStatusColor } from '@/lib/utils'
import {
  Card, CardContent, Button, Select,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Spinner, Modal,
} from '@/components/ui'
import { ClipboardList, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PatientBookingsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [cancellingId, setCancellingId] = useState<number | null>(null)

  useEffect(() => {
    if (user) fetchBookings()
  }, [user])

  const fetchBookings = async () => {
    if (!user) return
    try {
      const data = await bookingService.getByPatient(user.id)
      setBookings(data)
    } catch (error) {
      toast.error('Không thể tải danh sách lịch hẹn')
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus && b.statusId !== filterStatus) return false
    return true
  })

  const handleCancel = async (booking: Booking) => {
    if (!confirm('Bạn có chắc muốn hủy lịch hẹn này?')) return
    
    setCancellingId(booking.id)
    try {
      await bookingService.cancel(booking.id)
      toast.success('Đã hủy lịch hẹn')
      fetchBookings()
    } catch (error) {
      toast.error('Không thể hủy lịch hẹn')
    } finally {
      setCancellingId(null)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Lịch hẹn của tôi</h1>

      {/* Filter */}
      <div className="mb-4">
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: 'S1', label: 'Chờ xác nhận' },
            { value: 'S2', label: 'Đã xác nhận' },
            { value: 'S3', label: 'Đã hủy' },
            { value: 'S4', label: 'Đã hoàn thành' },
          ]}
          placeholder="Tất cả trạng thái"
          className="w-48"
        />
      </div>

      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Bạn chưa có lịch hẹn nào</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Khung giờ</TableHead>
                <TableHead>Bác sĩ</TableHead>
                <TableHead>Chuyên khoa</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{formatShortDate(booking.date)}</TableCell>
                  <TableCell>{booking.timeTypeData?.valueVi || booking.timeType}</TableCell>
                  <TableCell>
                    {booking.doctorData ? getFullName(booking.doctorData) : '-'}
                  </TableCell>
                  <TableCell>{booking.doctorData?.specialtyData?.name || '-'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.statusId)}`}>
                      {getStatusName(booking.statusId)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {(booking.statusId === 'S1' || booking.statusId === 'S2') && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCancel(booking)}
                        disabled={cancellingId === booking.id}
                      >
                        <X className="h-4 w-4 text-red-500" />
                        Hủy
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
