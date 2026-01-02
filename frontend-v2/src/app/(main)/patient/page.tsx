'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { specialtyService, doctorService } from '@/lib/services'
import type { Specialty, User } from '@/types'
import { getFullName } from '@/lib/utils'
import { Card, CardContent, Spinner } from '@/components/ui'
import { Stethoscope, Users, ArrowRight } from 'lucide-react'

export default function PatientDashboard() {
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [doctors, setDoctors] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specialtiesData, doctorsData] = await Promise.all([
          specialtyService.getAll(),
          doctorService.getAll(),
        ])
        setSpecialties(specialtiesData.slice(0, 6))
        setDoctors(doctorsData.slice(0, 4))
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Xin chào! Bạn cần khám gì hôm nay?</h1>

      {/* Specialties Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Chuyên khoa phổ biến</h2>
          <Link href="/patient/specialties" className="text-primary-600 hover:text-primary-700 flex items-center">
            Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {specialties.map((specialty) => (
            <Link key={specialty.id} href={`/patient/specialties/${specialty.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Stethoscope className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm">{specialty.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Doctors Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Bác sĩ nổi bật</h2>
          <Link href="/patient/doctors" className="text-primary-600 hover:text-primary-700 flex items-center">
            Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {doctors.map((doctor) => (
            <Link key={doctor.id} href={`/patient/doctors/${doctor.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{getFullName(doctor)}</h3>
                      <p className="text-sm text-gray-500">{doctor.specialtyData?.name || 'Chuyên khoa'}</p>
                      <p className="text-xs text-primary-600">{doctor.positionData?.valueVi || ''}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
