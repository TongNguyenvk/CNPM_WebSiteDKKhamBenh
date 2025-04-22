// src/app/dashboard/doctor/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile } from "../lib/api";

export default function DoctorDashboard() {
  const router = useRouter();
  const [roleId, setRoleId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login?redirect=/dashboard/bacsi");
      return;
    }
    getUserProfile(token).then(profile => {
      setRoleId(profile.roleId);
    });
  }, [router]);

  if (roleId && roleId !== 'R2' && roleId !== 'R3') {
    return <div className="p-6 text-center text-red-500">Bạn không có quyền truy cập trang này.</div>;
  }

  const appointments = [
    { id: 1, patient: 'patient1', doctor: 'doctor1', date: '2025-03-15', status: 'Pending' },
    // Thêm các lịch hẹn khác nếu cần
  ];

  const handleAccept = (id: number) => {
    console.log(`Chấp nhận lịch hẹn ${id}`);
    alert('Lịch hẹn đã được chấp nhận!');
  };

  const handleCancel = (id: number) => {
    console.log(`Hủy lịch hẹn ${id}`);
    alert('Lịch hẹn đã bị hủy!');
  };

  return (
    <div style={{ padding: '10%', textAlign: 'center' }}>
      <h1>Quản lý lịch hẹn</h1>
      <ul>
        {appointments.map((appt) => (
          <li key={appt.id}>
            {appt.patient} - {appt.date} - Status: {appt.status}
            <button onClick={() => handleAccept(appt.id)}>Chấp nhận</button>
            <button onClick={() => handleCancel(appt.id)}>Hủy</button>
          </li>
        ))}
      </ul>
      <button onClick={() => router.push('/home')}>Quay lại</button>
    </div>
  );
}