'use client';
import React, { useState } from 'react';
import { getDoctorSchedules } from '../../../lib/api';

export default function PatientSchedulePage() {
    const [doctorId, setDoctorId] = useState<number>(0);
    const [date, setDate] = useState('');
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const data = await getDoctorSchedules(doctorId, date);
            setSchedules(data);
        } catch (error: unknown) {
            const err = error as Error;
            setError(err.message || 'Lỗi khi tải lịch khám');
        }
        setLoading(false);
    };

    return (
        <div>
            <h1>Xem lịch khám của bác sĩ</h1>
            <input
                type="number"
                placeholder="Nhập ID bác sĩ"
                value={doctorId || ''}
                onChange={e => setDoctorId(Number(e.target.value))}
            />
            <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
            />
            <button onClick={handleSearch} disabled={loading}>
                {loading ? 'Đang tải...' : 'Xem lịch'}
            </button>
            {error && <p>{error}</p>}
            <ul>
                {schedules.map(s => (
                    <li key={s.id}>
                        {s.date} - {s.timeType}
                    </li>
                ))}
            </ul>
        </div>
    );
} 