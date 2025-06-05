'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

interface LoginResponse {
  token: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response: LoginResponse = await loginUser({ email, password });
      localStorage.setItem('token', response.token);
      router.push('/dashboard');
    } catch (error) {
      let errorMessage = 'Đăng nhập thất bại';
      if (typeof error === 'object' && error !== null) {
        const apiError = error as ApiError;
        errorMessage = apiError.response?.data?.message || errorMessage;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      console.error('Login error:', error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-6xl flex rounded-2xl shadow-2xl overflow-hidden">
        {/* Left side - Image and Text */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-blue-600 to-blue-400 p-12 flex-col justify-between relative">
          <div className="relative z-10">
            <Image
              src="/image/logo.jpg" // Thêm logo của bệnh viện/phòng khám
              alt="Medical Logo"
              width={150}
              height={50}
              className="mb-8"
            />
            <h2 className="text-4xl font-bold text-white mb-6">
              Chào mừng đến với Hệ thống Đặt lịch Khám bệnh
            </h2>
            <p className="text-blue-100 text-lg">
              Đặt lịch khám bệnh trực tuyến - Tiết kiệm thời gian,
              tối ưu hiệu quả
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 right-0 opacity-10">
            <svg width="320" height="320" viewBox="0 0 320 320">
              <path
                fill="white"
                d="M160 0c88.4 0 160 71.6 160 160s-71.6 160-160 160S0 248.4 0 160 71.6 0 160 0zm0 32C89.3 32 32 89.3 32 160s57.3 128 128 128 128-57.3 128-128S230.7 32 160 32z"
              />
            </svg>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8">
              Đăng nhập vào tài khoản
            </h1>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-2">
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 p-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-500 mb-2">
                  Mật khẩu
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 p-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Forgot password link */}
              <div className="flex justify-end">
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Quên mật khẩu?
                </a>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all
                  ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-xl'
                  }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : 'Đăng nhập'}
              </button>
            </form>

            {/* Register link */}
            <p className="mt-8 text-center text-gray-600">
              Chưa có tài khoản?{' '}
              <a href="/register" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                Đăng ký ngay
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;