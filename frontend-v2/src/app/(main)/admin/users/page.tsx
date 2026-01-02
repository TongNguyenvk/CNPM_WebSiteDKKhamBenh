'use client'

import { useEffect, useState, useMemo } from 'react'
import { userService, specialtyService } from '@/lib/services'
import { POSITIONS } from '@/lib/services/allcode.service'
import type { User, Specialty } from '@/types'
import { getFullName } from '@/lib/utils'
import {
  Button, Input, Select, SlidePanel, DataTable, Spinner,
  PageLayout, PageHeader, PageContent,
} from '@/components/ui'
import { Plus, Pencil, Trash2, Search, Users, Stethoscope, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

type UserRole = 'R1' | 'R2' | 'R3'

const ROLE_CONFIG = {
  R1: { label: 'Bệnh nhân', icon: Users, color: 'bg-blue-500' },
  R2: { label: 'Bác sĩ', icon: Stethoscope, color: 'bg-green-500' },
  R3: { label: 'Admin', icon: Shield, color: 'bg-purple-500' },
}

export default function UsersPage() {
  const [users, setUsers] = useState<{ R1: User[]; R2: User[]; R3: User[] }>({ R1: [], R2: [], R3: [] })
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<UserRole>('R1')
  const [searchTerm, setSearchTerm] = useState('')
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: '',
    phoneNumber: '', address: '', gender: '',
    positionId: 'P1', specialtyId: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [usersData, specialtiesData] = await Promise.all([
        userService.getAllUsers(),
        specialtyService.getAll(),
      ])
      setUsers(usersData)
      setSpecialties(specialtiesData)
    } catch (error) {
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = useMemo(() => {
    return users[activeTab].filter((user) => {
      const fullName = getFullName(user).toLowerCase()
      const email = user.email.toLowerCase()
      const search = searchTerm.toLowerCase()
      return fullName.includes(search) || email.includes(search)
    })
  }, [users, activeTab, searchTerm])

  const openCreatePanel = () => {
    setEditingUser(null)
    setFormData({
      email: '', password: '', firstName: '', lastName: '',
      phoneNumber: '', address: '', gender: '',
      positionId: 'P1', specialtyId: '',
    })
    setIsPanelOpen(true)
  }

  const openEditPanel = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      gender: user.gender !== undefined ? String(user.gender) : '',
      positionId: user.positionId || 'P1',
      specialtyId: user.specialtyId ? String(user.specialtyId) : '',
    })
    setIsPanelOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, {
          ...formData,
          gender: formData.gender ? formData.gender === 'true' : undefined,
          specialtyId: formData.specialtyId ? Number(formData.specialtyId) : undefined,
        })
        toast.success('Cập nhật thành công')
      } else {
        if (activeTab === 'R2') {
          await userService.registerDoctor({
            ...formData,
            gender: formData.gender ? formData.gender === 'true' : undefined,
            specialtyId: formData.specialtyId ? Number(formData.specialtyId) : undefined,
          })
        } else if (activeTab === 'R3') {
          await userService.registerAdmin({
            ...formData,
            gender: formData.gender ? formData.gender === 'true' : undefined,
          })
        }
        toast.success('Tạo mới thành công')
      }
      setIsPanelOpen(false)
      fetchData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (user: User, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Bạn có chắc muốn xóa ${getFullName(user)}?`)) return
    try {
      await userService.deleteUser(user.id)
      toast.success('Xóa thành công')
      fetchData()
    } catch (error) {
      toast.error('Không thể xóa người dùng')
    }
  }

  const columns = useMemo(() => {
    const base = [
      { key: 'name', header: 'Họ tên', render: (u: User) => (
        <span className="font-medium text-gray-900">{getFullName(u)}</span>
      )},
      { key: 'email', header: 'Email' },
      { key: 'phoneNumber', header: 'SĐT', render: (u: User) => u.phoneNumber || '-' },
    ]
    
    if (activeTab === 'R2') {
      base.push({
        key: 'specialty',
        header: 'Chuyên khoa',
        render: (u: User) => (
          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
            {u.specialtyData?.name || '-'}
          </span>
        ),
      })
    }
    
    base.push({
      key: 'actions',
      header: '',
      width: 'w-24',
      render: (u: User) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); openEditPanel(u) }}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <Pencil className="h-4 w-4 text-gray-500" />
          </button>
          <button
            onClick={(e) => handleDelete(u, e)}
            className="p-1.5 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      ),
    })
    
    return base
  }, [activeTab])

  if (loading) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageLayout>
    )
  }

  const tabs: { key: UserRole; label: string; count: number }[] = [
    { key: 'R1', label: 'Bệnh nhân', count: users.R1.length },
    { key: 'R2', label: 'Bác sĩ', count: users.R2.length },
    { key: 'R3', label: 'Admin', count: users.R3.length },
  ]

  return (
    <PageLayout>
      <PageHeader
        title="Quản lý người dùng"
        subtitle={`${filteredUsers.length} ${ROLE_CONFIG[activeTab].label.toLowerCase()}`}
        actions={
          activeTab !== 'R1' && (
            <Button onClick={openCreatePanel} size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Thêm {ROLE_CONFIG[activeTab].label.toLowerCase()}
            </Button>
          )
        }
      />

      <PageContent noPadding className="flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-4 px-6 py-3 border-b bg-white">
          {/* Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = ROLE_CONFIG[tab.key].icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${
                    activeTab === tab.key ? 'bg-gray-100' : 'bg-gray-200'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
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
            data={filteredUsers}
            keyField="id"
            compact
            emptyMessage={`Không có ${ROLE_CONFIG[activeTab].label.toLowerCase()} nào`}
          />
        </div>
      </PageContent>

      {/* Slide Panel for Form */}
      <SlidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title={editingUser ? 'Chỉnh sửa thông tin' : `Thêm ${ROLE_CONFIG[activeTab].label.toLowerCase()}`}
        width="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Họ"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
            <Input
              label="Tên"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={!!editingUser}
          />
          
          {!editingUser && (
            <Input
              label="Mật khẩu"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Số điện thoại"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
            <Select
              label="Giới tính"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              options={[{ value: 'true', label: 'Nam' }, { value: 'false', label: 'Nữ' }]}
              placeholder="Chọn"
            />
          </div>
          
          {activeTab === 'R2' && (
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Chuyên khoa"
                value={formData.specialtyId}
                onChange={(e) => setFormData({ ...formData, specialtyId: e.target.value })}
                options={specialties.map((s) => ({ value: s.id, label: s.name }))}
                placeholder="Chọn"
                required
              />
              <Select
                label="Chức vụ"
                value={formData.positionId}
                onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
                options={POSITIONS.map((p) => ({ value: p.keyMap, label: p.valueVi }))}
              />
            </div>
          )}

          <Input
            label="Địa chỉ"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
              {editingUser ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </SlidePanel>
    </PageLayout>
  )
}
