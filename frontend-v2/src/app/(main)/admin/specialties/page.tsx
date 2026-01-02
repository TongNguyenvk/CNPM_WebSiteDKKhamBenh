'use client'

import { useEffect, useState, useMemo } from 'react'
import { specialtyService } from '@/lib/services'
import type { Specialty } from '@/types'
import {
  Button, Input, SlidePanel, DataTable, Spinner,
  PageLayout, PageHeader, PageContent,
} from '@/components/ui'
import { Plus, Pencil, Trash2, Search, Stethoscope } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchSpecialties()
  }, [])

  const fetchSpecialties = async () => {
    try {
      const data = await specialtyService.getAll()
      setSpecialties(data)
    } catch (error) {
      toast.error('Không thể tải danh sách chuyên khoa')
    } finally {
      setLoading(false)
    }
  }

  const filteredSpecialties = useMemo(() => {
    return specialties.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [specialties, searchTerm])

  const openCreatePanel = () => {
    setEditingSpecialty(null)
    setFormData({ name: '', description: '' })
    setIsPanelOpen(true)
  }

  const openEditPanel = (specialty: Specialty) => {
    setEditingSpecialty(specialty)
    setFormData({ name: specialty.name, description: specialty.description || '' })
    setIsPanelOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên chuyên khoa')
      return
    }

    setSubmitting(true)
    try {
      if (editingSpecialty) {
        await specialtyService.update(editingSpecialty.id, formData)
        toast.success('Cập nhật thành công')
      } else {
        await specialtyService.create(formData)
        toast.success('Tạo mới thành công')
      }
      setIsPanelOpen(false)
      fetchSpecialties()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (specialty: Specialty, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Bạn có chắc muốn xóa chuyên khoa "${specialty.name}"?`)) return
    try {
      await specialtyService.delete(specialty.id)
      toast.success('Xóa thành công')
      fetchSpecialties()
    } catch (error) {
      toast.error('Không thể xóa chuyên khoa')
    }
  }

  const columns = useMemo(() => [
    {
      key: 'id',
      header: 'ID',
      width: 'w-16',
      render: (s: Specialty) => (
        <span className="text-gray-500 text-xs">#{s.id}</span>
      ),
    },
    {
      key: 'name',
      header: 'Tên chuyên khoa',
      render: (s: Specialty) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <Stethoscope className="h-4 w-4 text-blue-600" />
          </div>
          <span className="font-medium text-gray-900">{s.name}</span>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Mô tả',
      render: (s: Specialty) => (
        <span className="text-gray-500 text-sm line-clamp-1">
          {s.description ? s.description.replace(/<[^>]*>/g, '').substring(0, 80) : '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: 'w-24',
      render: (s: Specialty) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); openEditPanel(s) }}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <Pencil className="h-4 w-4 text-gray-500" />
          </button>
          <button
            onClick={(e) => handleDelete(s, e)}
            className="p-1.5 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
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
        title="Quản lý chuyên khoa"
        subtitle={`${filteredSpecialties.length} chuyên khoa`}
        actions={
          <Button onClick={openCreatePanel} size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Thêm chuyên khoa
          </Button>
        }
      />

      <PageContent noPadding className="flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-4 px-6 py-3 border-b bg-white">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm chuyên khoa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-hidden bg-white">
          <DataTable
            columns={columns}
            data={filteredSpecialties}
            keyField="id"
            compact
            emptyMessage="Chưa có chuyên khoa nào"
          />
        </div>
      </PageContent>

      {/* Slide Panel for Form */}
      <SlidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title={editingSpecialty ? 'Chỉnh sửa chuyên khoa' : 'Thêm chuyên khoa mới'}
        width="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên chuyên khoa"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="VD: Tim mạch, Nội khoa..."
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả ngắn về chuyên khoa..."
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

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
              {editingSpecialty ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </SlidePanel>
    </PageLayout>
  )
}
