'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { bookingService } from '@/lib/services'
import type { Booking, BookingStatus } from '@/types'
import { getFullName, formatShortDate, getStatusName, getStatusColor } from '@/lib/utils'
import {
  Card, CardContent, Button, Select,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Spinner, Badge, Modal,
} from '@/components/ui'
import { ClipboardList, Check, X, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DoctorBookingsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [processingId, setProcessingId] = useState<number | null>(null)

  useEffect(() => {
    if (user) fetchBookings()
  }, [user])

  const fetchBookings = async () => {
    if (!user) return
    try {
      const data = await bookingService.getByDoctor(user.id)
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

  const handleUpdateStatus = async (booking: Booking, newStatus: BookingStatus) => {
    setProcessingId(booking.id)
    try {
      await bookingService.updateStatus(booking.id, newStatus)
      toast.success('Cập nhật trạng thái thành công')
      fetchBookings()
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái')
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  }

  const pendingCount = bookings.filter((b) => b.statusId === 'S1').length

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <h1 className="page-title mb-0">Lịch hẹn của bệnh nhân</h1>
          {pendingCount > 0 && (
            <Badge variant="warning">{pendingCount} chờ xác nhận</Badge>
          )}
        </div>
      </div>

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
            <p className="text-gray-500">Không có lịch hẹn nào</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Khung giờ</TableHead>
                <TableHead>Bệnh nhân</TableHead>
                <TableHead>SĐT</TableHead>
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
                    {booking.patientData ? getFullName(booking.patientData) : '-'}
                  </TableCell>
                  <TableCell>{booking.patientData?.phoneNumber || '-'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.statusId)}`}>
                      {getStatusName(booking.statusId)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {booking.statusId === 'S1' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(booking, 'S2')}
                            disabled={processingId === booking.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleUpdateStatus(booking, 'S3')}
                            disabled={processingId === booking.id}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {booking.statusId === 'S2' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(booking, 'S4')}
                          disabled={processingId === booking.id}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Hoàn thành
                        </Button>
                      )}
                    </div>
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
