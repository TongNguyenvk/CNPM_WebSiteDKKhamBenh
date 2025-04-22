// src/app/dashboard/admin/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile } from "../lib/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [roleId, setRoleId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login?redirect=/dashboard/admin");
      return;
    }
    getUserProfile(token).then(profile => {
      setRoleId(profile.roleId);
    });
  }, [router]);

  if (roleId && roleId !== 'R3') {
    return <div className="p-6 text-center text-red-500">Bạn không có quyền truy cập trang này.</div>;
  }

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