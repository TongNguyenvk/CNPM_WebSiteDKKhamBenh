'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { doctorService, specialtyService } from '@/lib/services'
import type { User, Specialty } from '@/types'
import { getFullName } from '@/lib/utils'
import { Card, CardContent, Spinner, Input, Select } from '@/components/ui'
import { Users, Search } from 'lucide-react'

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<User[]>([])
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSpecialty, setFilterSpecialty] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsData, specialtiesData] = await Promise.all([
          doctorService.getAll(),
          specialtyService.getAll(),
        ])
        setDoctors(doctorsData)
        setSpecialties(specialtiesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredDoctors = doctors.filter((d) => {
    const fullName = getFullName(d).toLowerCase()
    const matchesSearch = fullName.includes(searchTerm.toLowerCase())
    const matchesSpecialty = !filterSpecialty || d.specialtyId === Number(filterSpecialty)
    return matchesSearch && matchesSpecialty
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Danh sách bác sĩ</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm bác sĩ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filterSpecialty}
          onChange={(e) => setFilterSpecialty(e.target.value)}
          options={specialties.map((s) => ({ value: s.id, label: s.name }))}
          placeholder="Tất cả chuyên khoa"
          className="w-48"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map((doctor) => (
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
                    <p className="text-sm text-gray-500 mt-1">{doctor.specialtyData?.name || ''}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Không tìm thấy bác sĩ nào
        </div>
      )}
    </div>
  )
}
