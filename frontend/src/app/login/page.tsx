'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/app/lib/api';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

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
      router.push('/home');
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
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-tr from-blue-100 via-white to-purple-100 px-4">
      {/* Vòng tròn background */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-blue-300 to-purple-300 rounded-full opacity-30 blur-3xl top-[-100px] left-[-100px] z-0"></div>

      <div className="relative bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md z-10">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8 tracking-wide">Chào mừng bạn 🎉</h1>

        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-black placeholder-gray-500"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-black placeholder-gray-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end text-sm text-gray-500">
            <a href="/forgot-password" className="hover:text-blue-600 hover:underline">
              Quên mật khẩu?
            </a>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 text-white rounded-xl font-semibold transition-all ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-md'
            }`}
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Chưa có tài khoản?{' '}
          <a href="/register" className="text-blue-600 hover:underline font-medium">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;