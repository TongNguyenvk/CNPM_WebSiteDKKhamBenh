'use client';
import React, { useEffect, useState } from 'react';
import { getBookingsByPatientId } from '@/lib/api';

export default function PatientAppointmentsPage() {
    const [patientId, setPatientId] = useState<number>(0);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleLoad = async () => {
        setLoading(true);
        try {
            const data = await getBookingsByPatientId(patientId);
            setBookings(data);
        } catch (err: any) {
            alert('Lỗi tải lịch: ' + err.message);
        }
        setLoading(false);
    };

    return (
        <div>
            <h1>Lịch đã đặt của tôi</h1>
            <input
                type="number"
                placeholder="Nhập ID bệnh nhân"
                value={patientId || ''}
                onChange={e => setPatientId(Number(e.target.value))}
            />
            <button onClick={handleLoad} disabled={loading}>
                {loading ? 'Đang tải...' : 'Xem lịch'}
            </button>
            <ul>
                {bookings.map(b => (
                    <li key={b.id}>
                        {b.date} - {b.timeType} - Bác sĩ: {b.doctorData?.lastName} {b.doctorData?.firstName}
                        {/* Thêm nút hủy lịch nếu muốn */}
                    </li>
                ))}
            </ul>
        </div>
    );
} 