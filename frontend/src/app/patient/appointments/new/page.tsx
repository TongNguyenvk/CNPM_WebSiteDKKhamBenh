'use client';
import React, { useState } from 'react';
import { createBooking } from '@/lib/api';

// Trang đặt lịch khám cho bệnh nhân
export default function NewAppointmentPage() {
    const [doctorId, setDoctorId] = useState<number>(0);
    const [patientId, setPatientId] = useState<number>(0);
    const [date, setDate] = useState('');
    const [timeType, setTimeType] = useState('');
    const [statusId] = useState('S1'); // Trạng thái mặc định
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createBooking({ doctorId, patientId, date, timeType, statusId });
            alert('Đặt lịch thành công!');
        } catch (error: unknown) {
            const err = error as Error;
            setError(err.message || 'Lỗi khi tạo lịch hẹn');
        }
        setLoading(false);
    };

    return (
        <div>
            <h1>Đặt lịch khám</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="ID bác sĩ"
                    value={doctorId || ''}
                    onChange={e => setDoctorId(Number(e.target.value))}
                    required
                />
                <input
                    type="number"
                    placeholder="ID bệnh nhân"
                    value={patientId || ''}
                    onChange={e => setPatientId(Number(e.target.value))}
                    required
                />
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Khung giờ (T1, T2...)"
                    value={timeType}
                    onChange={e => setTimeType(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang đặt...' : 'Đặt lịch'}
                </button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
} 