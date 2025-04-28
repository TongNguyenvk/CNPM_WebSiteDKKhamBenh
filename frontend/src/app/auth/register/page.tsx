'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api';

// Trang đăng ký (bệnh nhân, admin)
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
      const response = await registerUser({ email, password, firstName, lastName, roleId: 'R1' });
        // Điều hướng dựa vào role từ backend
        // Giả sử roleId trong database là: R1 (patient), R2 (doctor), R3 (admin)
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
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-white-200 to-blue-400 px-6 py-12">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Đăng ký tài khoản
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Họ"
            className="w-full p-3 rounded-lg  focus:ring-blue-400"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Tên"
            className="w-full p-3 rounded-lg  focus:ring-blue-400"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg  focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full p-3 rounded-lg  focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Đã có tài khoản?{' '}
          <a href="/auth/login" className="text-blue-600 hover:underline font-semibold">
            Đăng nhập ngay
          </a>
        </p>
      </div>
    </div>
  );
}
