'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { doctorService, scheduleService, bookingService } from '@/lib/services'
import type { User, Schedule } from '@/types'
import { getFullName, formatShortDate, formatDate } from '@/lib/utils'
import { Card, CardContent, Spinner, Button, Modal, Badge } from '@/components/ui'
import { Users, ArrowLeft, Calendar, Clock, MapPin, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DoctorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const doctorId = Number(params.id)
  
  const [doctor, setDoctor] = useState<User | null>(null)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorData, schedulesData] = await Promise.all([
          doctorService.getById(doctorId),
          scheduleService.getByDoctor(doctorId),
        ])
        setDoctor(doctorData)
        // Only show approved schedules with available slots
        setSchedules(schedulesData.filter(s => s.status === 'approved' && s.currentNumber < s.maxNumber))
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (doctorId) fetchData()
  }, [doctorId])

  const handleBooking = async () => {
    if (!selectedSchedule || !user) return
    
    setBooking(true)
    try {
      await bookingService.create({
        doctorId: selectedSchedule.doctorId,
        patientId: user.id,
        date: selectedSchedule.date,
        timeType: selectedSchedule.timeType,
      })
      toast.success('Đặt lịch thành công!')
      setSelectedSchedule(null)
      router.push('/patient/bookings')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể đặt lịch')
    } finally {
      setBooking(false)
    }
  }

  // Group schedules by date
  const schedulesByDate = schedules.reduce((acc, schedule) => {
    const date = schedule.date
    if (!acc[date]) acc[date] = []
    acc[date].push(schedule)
    return acc
  }, {} as Record<string, Schedule[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="page-container text-center py-12">
        <p className="text-gray-500">Không tìm thấy bác sĩ</p>
        <Link href="/patient/doctors">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="page-container">
      {/* Back button */}
      <Link href="/patient/doctors" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Quay lại
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctor Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="h-12 w-12 text-gray-500" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{getFullName(doctor)}</h1>
                  <p className="text-lg text-primary-600">{doctor.positionData?.valueVi || ''}</p>
                  <p className="text-gray-600 mt-1">{doctor.specialtyData?.name || ''}</p>
                  
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    {doctor.address && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {doctor.address}
                      </div>
                    )}
                    {doctor.phoneNumber && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {doctor.phoneNumber}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {doctor.doctorDetail?.descriptionHTML && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-3">Giới thiệu</h3>
                  <div
                    className="prose prose-sm max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: doctor.doctorDetail.descriptionHTML }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Schedule */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                Lịch khám
              </h3>

              {Object.keys(schedulesByDate).length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Bác sĩ chưa có lịch khám
                </p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(schedulesByDate).map(([date, dateSchedules]) => (
                    <div key={date}>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        {formatDate(date)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {dateSchedules.map((schedule) => (
                          <button
                            key={schedule.id}
                            onClick={() => setSelectedSchedule(schedule)}
                            className="px-3 py-2 text-sm border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
                          >
                            <Clock className="h-3 w-3 inline mr-1" />
                            {schedule.timeTypeData?.valueVi || schedule.timeType}
                            <span className="text-xs text-gray-500 ml-1">
                              ({schedule.maxNumber - schedule.currentNumber} chỗ)
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={!!selectedSchedule}
        onClose={() => setSelectedSchedule(null)}
        title="Xác nhận đặt lịch"
      >
        {selectedSchedule && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><strong>Bác sĩ:</strong> {getFullName(doctor)}</p>
              <p><strong>Chuyên khoa:</strong> {doctor.specialtyData?.name}</p>
              <p><strong>Ngày khám:</strong> {formatDate(selectedSchedule.date)}</p>
              <p><strong>Giờ khám:</strong> {selectedSchedule.timeTypeData?.valueVi}</p>
            </div>
            
            <p className="text-sm text-gray-600">
              Bạn có chắc chắn muốn đặt lịch khám này? Sau khi đặt, lịch hẹn sẽ được gửi đến bác sĩ để xác nhận.
            </p>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setSelectedSchedule(null)}>
                Hủy
              </Button>
              <Button onClick={handleBooking} loading={booking}>
                Xác nhận đặt lịch
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
