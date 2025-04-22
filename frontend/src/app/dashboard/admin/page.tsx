// src/app/dashboard/admin/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile } from "../../lib/api";
import Image from "next/image";

export default function AdminDashboard() {
  const router = useRouter();
  const [roleId, setRoleId] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login?redirect=/dashboard/admin");
      return;
    }
    getUserProfile(token).then(profile => {
      setRoleId(profile.roleId);
      setUser(profile);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      router.replace("/login?redirect=/dashboard/admin");
    });
  }, [router]);

  if (loading) return <div className="p-6 text-center">Đang tải trang quản trị...</div>;
  if (roleId && roleId !== 'R3') {
    return <div className="p-6 text-center text-red-500">Bạn không có quyền truy cập trang này.</div>;
  }

  // Danh sách người dùng mẫu
  const users = [
    { id: 1, username: 'benhnhan1', role: 'Bệnh nhân' },
    { id: 2, username: 'bacsi1', role: 'Bác sĩ' },
    { id: 3, username: 'admin1', role: 'Admin' },
    { id: 4, username: 'nhanvien1', role: 'Nhân viên' },
  ];

  const handleManageUser = (id: number) => {
    alert('Quản lý người dùng ' + id);
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", background: "#f5f7fa" }}>
      {/* NavBar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Image src="https://phuongnamvina.com/img_data/images/logo-benh-vien.jpg" alt="Logo" width={100} height={50} className="rounded-md shadow-sm" />
        </div>
        {/* Menu */}
        <ul className="flex space-x-12 text-lg font-medium items-center">
          <li>
            <button onClick={() => router.push("/dashboard")} className="hover:text-blue-600 transition-colors duration-200 bg-transparent border-none">Dashboard</button>
          </li>
          <li>
            <button onClick={() => router.push("/contact")} className="hover:text-blue-600 transition-colors duration-200 bg-transparent border-none">Liên hệ</button>
          </li>
          <li>
            <button onClick={() => router.push("/profile")} className="hover:text-blue-600 transition-colors duration-200 bg-transparent border-none">Tôi</button>
          </li>
          
          <li>
            <div className="flex items-center space-x-2">
              <Image src={user?.image ? `/${user.image}` : "/default-avatar.png"} alt="avatar" width={40} height={40} className="rounded-full border" />
              <span className="text-base font-semibold">{user?.firstName || "Admin"}</span>
            </div>
          </li>
        </ul>
      </nav>
      {/* Khoảng trống cho nav */}
      <div style={{ marginTop: "100px" }}></div>

      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-3xl text-center">
          <h1 className="text-3xl font-bold mb-8 text-blue-700">Quản lý hệ thống</h1>
          <table className="w-full mb-8 border rounded-xl overflow-hidden">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Tên đăng nhập</th>
                <th className="py-3 px-4">Vai trò</th>
                <th className="py-3 px-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-blue-50">
                  <td className="py-2 px-4">{user.id}</td>
                  <td className="py-2 px-4">{user.username}</td>
                  <td className="py-2 px-4">{user.role}</td>
                  <td className="py-2 px-4">
                    <button onClick={() => handleManageUser(user.id)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition">Quản lý</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => router.push('/dashboard')} className="w-full p-3 mt-4 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300">Quay lại Dashboard</button>
        </div>
      </div>
    </div>
  );
}