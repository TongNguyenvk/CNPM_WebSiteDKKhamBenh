'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await registerUser({
        email,
        password,
        firstName,
        lastName,
      });

      // Điều hướng dựa vào role từ backend
      switch (response.role) {
        case 'R1':
          router.push('/patient/dashboard');
          break;
        case 'R2':
          router.push('/doctor/dashboard');
          break;
        case 'R3':
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/');
      }
    } catch (error: unknown) {
      const err = error as Error;
      setError(err.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl flex rounded-3xl shadow-large overflow-hidden bg-white">
        {/* Left side - Register Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                Đăng ký tài khoản
              </h2>
              <p className="text-neutral-600">
                Tạo tài khoản mới để sử dụng dịch vụ
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error-50 border border-error-200 text-error-700 rounded-xl">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-error-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Họ</label>
                  <input
                    type="text"
                    placeholder="Nhập họ"
                    className="form-input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tên</label>
                  <input
                    type="text"
                    placeholder="Nhập tên"
                    className="form-input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mật khẩu</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="loading-spinner w-4 h-4"></div>
                    <span>Đang đăng ký...</span>
                  </div>
                ) : (
                  'Đăng ký'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-neutral-600">
                Đã có tài khoản?{' '}
                <Link href="/auth/login" className="link font-medium">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-12 flex-col justify-between relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-primary-800/90"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">PK</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Phòng Khám</h1>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white leading-tight">
                Tham gia cùng chúng tôi!
              </h2>
              <p className="text-primary-100 text-lg leading-relaxed">
                Đăng ký tài khoản để trải nghiệm hệ thống đặt lịch khám bệnh hiện đại.
                Quản lý sức khỏe của bạn một cách thông minh và tiện lợi.
              </p>

              <div className="space-y-4 pt-6">
                <div className="flex items-center space-x-3 text-primary-100">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Đặt lịch khám 24/7</span>
                </div>
                <div className="flex items-center space-x-3 text-primary-100">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Nhận thông báo tự động</span>
                </div>
                <div className="flex items-center space-x-3 text-primary-100">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Theo dõi hồ sơ sức khỏe</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-primary-100 text-sm">
            © 2024 Phòng Khám. Tất cả quyền được bảo lưu.
          </div>
        </div>
      </div>
    </div>
  );
}
