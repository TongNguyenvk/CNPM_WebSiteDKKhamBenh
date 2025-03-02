// src/app/dashboard/doctor/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function DoctorDashboard() {
  const router = useRouter();

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