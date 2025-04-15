'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: number;
  email: string;
  role?: string;
  exp?: number;
  [key: string]: unknown;
}

function HomePage() {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        console.log('Decoded JWT Token:', decodedToken);

        const isExpired =
          (decodedToken.exp !== undefined && typeof decodedToken.exp === 'number'
            ? decodedToken.exp
            : 0) * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }

        setUser(decodedToken);
      } catch (error) {
        console.error('Lỗi giải mã token:', error);
        localStorage.removeItem('token');
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg animate-pulse">Đang chuyển hướng...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Trang chủ</h1>
        <p className="text-gray-700 mb-2">👋 Chào mừng, <span className="font-medium text-blue-600">{user.email}</span></p>
        <p className="text-gray-700 mb-2">🆔 Mã người dùng: <span className="font-medium">{user.userId}</span></p>
        {user.role && (
          <p className="text-gray-700 mb-4">🎓 Vai trò: <span className="font-medium capitalize">{user.role}</span></p>
        )}
        <div className="bg-gray-100 rounded-md p-3 text-sm text-gray-600 mb-6">
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            router.push('/login');
          }}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

export default HomePage;
