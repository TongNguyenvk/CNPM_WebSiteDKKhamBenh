'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { specialtyService, doctorService } from '@/lib/services'
import type { Specialty, User } from '@/types'
import { getFullName } from '@/lib/utils'
import { Card, CardContent, Spinner, Button } from '@/components/ui'
import { Users, ArrowLeft } from 'lucide-react'

export default function SpecialtyDetailPage() {
  const params = useParams()
  const specialtyId = Number(params.id)
  const [specialty, setSpecialty] = useState<Specialty | null>(null)
  const [doctors, setDoctors] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specialtyData, doctorsData] = await Promise.all([
          specialtyService.getById(specialtyId),
          doctorService.getBySpecialty(specialtyId),
        ])
        setSpecialty(specialtyData)
        setDoctors(doctorsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (specialtyId) fetchData()
  }, [specialtyId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!specialty) {
    return (
      <div className="page-container text-center py-12">
        <p className="text-gray-500">Không tìm thấy chuyên khoa</p>
        <Link href="/patient/specialties">
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
      <Link href="/patient/specialties" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Quay lại
      </Link>

      {/* Specialty Info */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{specialty.name}</h1>
          {specialty.description && (
            <div
              className="prose prose-sm max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: specialty.description }}
            />
          )}
        </CardContent>
      </Card>

      {/* Doctors */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Bác sĩ chuyên khoa {specialty.name} ({doctors.length})
      </h2>

      {doctors.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Chưa có bác sĩ nào trong chuyên khoa này
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <Link key={doctor.id} href={`/patient/doctors/${doctor.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="h-8 w-8 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{getFullName(doctor)}</h3>
                      <p className="text-sm text-primary-600">{doctor.positionData?.valueVi || ''}</p>
                      <p className="text-sm text-gray-500 mt-1">{specialty.name}</p>
                      {doctor.doctorDetail?.descriptionMarkdown && (
                        <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                          {doctor.doctorDetail.descriptionMarkdown.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
