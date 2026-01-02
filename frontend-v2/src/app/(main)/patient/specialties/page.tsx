'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { specialtyService } from '@/lib/services'
import type { Specialty } from '@/types'
import { Card, CardContent, Spinner, Input } from '@/components/ui'
import { Stethoscope, Search } from 'lucide-react'

export default function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await specialtyService.getAll()
        setSpecialties(data)
      } catch (error) {
        console.error('Error fetching specialties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSpecialties()
  }, [])

  const filteredSpecialties = specialties.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Chuyên khoa</h1>

      {/* Search */}
      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm chuyên khoa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredSpecialties.map((specialty) => (
          <Link key={specialty.id} href={`/patient/specialties/${specialty.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{specialty.name}</h3>
                {specialty.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {specialty.description.replace(/<[^>]*>/g, '').substring(0, 80)}...
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredSpecialties.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Không tìm thấy chuyên khoa nào
        </div>
      )}
    </div>
  )
}
