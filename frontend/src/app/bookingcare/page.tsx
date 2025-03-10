// src/app/booking/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingPage() {
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic giả lập để đặt lịch (có thể gọi API thực tế)
    console.log('Đặt lịch cho bác sĩ', doctorId, 'vào ngày', date);
    alert('Đặt lịch thành công!');
    router.push('/home');
  };

  return (
    <div style={{ padding: '10%', textAlign: 'center' }}>
      <h1>Đặt lịch khám</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Chọn bác sĩ:</label>
          <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
            <option value="">Chọn bác sĩ</option>
            {/* Danh sách bác sĩ từ trang home */}
            <option value="doctor1">Bác sĩ Chuyên khoa I Võ Thị Thanh Vân</option>
            <option value="doctor2">PGS. TS. BSCKII. TTUT Vũ Văn Hòe</option>
            {/* Thêm các bác sĩ khác nếu cần */}
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Ngày khám:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <button type="submit">Đặt lịch</button>
      </form>
    </div>
  );
}