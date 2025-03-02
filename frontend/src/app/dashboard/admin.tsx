// src/app/dashboard/admin/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  const users = [
    { id: 1, username: 'benhnhan1', role: 'benhnhan' },
    { id: 2, username: 'bacsi1', role: 'bacsi' },
    // Thêm người dùng khác nếu cầ
  ];

  const handleManageUser = (id: number) => {
    console.log(`Quản lý người dùng ${id}`);
    alert('Quản lý người dùng thành công!');
  };

  return (
    <div style={{ padding: '10%', textAlign: 'center' }}>
      <h1>Quản lý hệ thống</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - Role: {user.role}
            <button onClick={() => handleManageUser(user.id)}>Quản lý</button>
          </li>
        ))}
      </ul>
      <button onClick={() => router.push('/home')}>Quay lại</button>
    </div>
  );
}