'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/lib/services'
import { Button, Input, Card, CardContent } from '@/components/ui'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    try {
      const response = await authService.login(formData)
      
      if (response.success) {
        setAuth(
          {
            id: response.userId,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            roleId: response.role as 'R1' | 'R2' | 'R3',
          },
          response.token
        )
        
        toast.success('Đăng nhập thành công!')
        
        // Redirect based on role
        switch (response.role) {
          case 'R1':
            router.push('/patient')
            break
          case 'R2':
            router.push('/doctor')
            break
          case 'R3':
            router.push('/admin')
            break
          default:
            router.push('/')
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại'
      const field = error.response?.data?.field
      
      if (field) {
        setErrors({ [field]: message })
      } else {
        toast.error(message)
      }
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
          <h2 className="text-2xl font-bold text-gray-900">Đăng nhập</h2>
          <p className="mt-2 text-gray-600">Chào mừng bạn quay trở lại</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="Nhập email của bạn"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                required
              />

              <Input
                id="password"
                type="password"
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                required
              />

              <Button type="submit" className="w-full" loading={loading}>
                Đăng nhập
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
