'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/lib/services'
import { Button, Input, Select, Card, CardContent } from '@/components/ui'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    gender: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) newErrors.email = 'Email là bắt buộc'
    if (!formData.password) newErrors.password = 'Mật khẩu là bắt buộc'
    if (formData.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }
    if (!formData.firstName) newErrors.firstName = 'Tên là bắt buộc'
    if (!formData.lastName) newErrors.lastName = 'Họ là bắt buộc'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setLoading(true)

    try {
      await authService.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber || undefined,
        address: formData.address || undefined,
        gender: formData.gender ? formData.gender === 'true' : undefined,
      })
      
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
      router.push('/login')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng ký thất bại'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Medical Booking</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Đăng ký tài khoản</h2>
          <p className="mt-2 text-gray-600">Tạo tài khoản bệnh nhân mới</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="lastName"
                  label="Họ"
                  placeholder="Nguyễn"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  error={errors.lastName}
                  required
                />
                <Input
                  id="firstName"
                  label="Tên"
                  placeholder="Văn A"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  error={errors.firstName}
                  required
                />
              </div>

              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                required
              />

              <Input
                id="phoneNumber"
                type="tel"
                label="Số điện thoại"
                placeholder="0123456789"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />

              <Select
                id="gender"
                label="Giới tính"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                options={[
                  { value: 'true', label: 'Nam' },
                  { value: 'false', label: 'Nữ' },
                ]}
                placeholder="Chọn giới tính"
              />

              <Input
                id="address"
                label="Địa chỉ"
                placeholder="Nhập địa chỉ"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />

              <Input
                id="password"
                type="password"
                label="Mật khẩu"
                placeholder="Tối thiểu 6 ký tự"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                required
              />

              <Input
                id="confirmPassword"
                type="password"
                label="Xác nhận mật khẩu"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
                required
              />

              <Button type="submit" className="w-full" loading={loading}>
                Đăng ký
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
