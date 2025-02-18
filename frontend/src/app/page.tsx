'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; // Cài đặt: npm install jwt-decode

interface DecodedToken {
  userId: number;
  email: string;
  [key: string]: any; // Cho phép các trường khác
}

function HomePage() {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        console.log('Decoded JWT Token:', decodedToken); // Log để kiểm tra

        // Kiểm tra token hết hạn
        const isExpired = (decodedToken.exp || 0) * 1000 < Date.now();
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
      // Nếu không có token, điều hướng đến trang đăng nhập
      router.push('/login');
    }
  }, [router]);

  if (!user) {
    return <div>Đang chuyển hướng...</div>;
  }

  return (
    <div>
      <h1>Trang chủ</h1>
      {user && (
        <>
          <p>Chào mừng, {user.email}!</p>
          <p>User ID: {user.userId}</p>
          <p>Vai trò: {user.role}</p>
          {/* In ra object user để kiểm tra */}
          <pre>{JSON.stringify(user, null, 2)}</pre>
          <button onClick={() => {
            localStorage.removeItem('token');
            router.push('/login');
          }}>Đăng xuất</button>
        </>
      )}
    </div>
  );
}

export default HomePage;