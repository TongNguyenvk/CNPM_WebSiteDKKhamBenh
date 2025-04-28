'use client';
import React, { useState } from 'react';
import { getDoctorSchedules } from '../../../lib/api';

export default function PatientSchedulePage() {
    const [doctorId, setDoctorId] = useState<number>(0);
    const [date, setDate] = useState('');
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const data = await getDoctorSchedules(doctorId, date);
            setSchedules(data);
        } catch (err: any) {
            alert('Lỗi tải lịch: ' + err.message);
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